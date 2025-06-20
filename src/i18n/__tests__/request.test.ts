import { match as matchLocale } from "@formatjs/intl-localematcher";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_TEXT, LOCALE_VALUES } from "@/i18n/config";
import { negotiateLocale } from "../request";

// Next.js のサーバー関数をモック
jest.mock("next/headers", () => ({
	cookies: jest.fn(),
	headers: jest.fn(),
}));

jest.mock("@formatjs/intl-localematcher", () => ({
	match: jest.fn(),
}));

// 型定義
interface MockCookieStore {
	get: jest.Mock;
}

interface MockHeaderStore {
	get: jest.Mock;
}

// negotiateLocale関数を直接テストするため、モジュールから抽出
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedHeaders = headers as jest.MockedFunction<typeof headers>;
const mockedMatchLocale = matchLocale as jest.MockedFunction<
	typeof matchLocale
>;

describe("negotiateLocale", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return locale from cookie when valid locale is set", async () => {
		// Cookie: locale=en の場合、'en'を返す
		const mockCookieStore = {
			get: jest.fn().mockReturnValue({ value: "en" }),
		};
		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);

		const locale = await negotiateLocale();
		expect(locale).toBe("en");
		expect(mockCookieStore.get).toHaveBeenCalledWith(LOCALE_TEXT);
	});

	it("should ignore invalid cookie locale and fallback to headers", async () => {
		// Cookie: locale=invalid の場合、Accept-Languageヘッダーを確認
		const mockCookieStore = {
			get: jest.fn().mockReturnValue({ value: "invalid" }),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);
		mockedMatchLocale.mockReturnValue("en");

		const locale = await negotiateLocale();
		expect(locale).toBe("en");
		expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
		expect(mockedMatchLocale).toHaveBeenCalledWith(
			["en-US", "en"],
			LOCALE_VALUES,
			DEFAULT_LOCALE,
		);
	});

	it("should negotiate locale from Accept-Language header", async () => {
		// Accept-Language: en-US,en;q=0.9,ja;q=0.8 の場合の動作
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);
		mockedMatchLocale.mockReturnValue("en");

		const locale = await negotiateLocale();
		expect(locale).toBe("en");
		expect(mockedMatchLocale).toHaveBeenCalledWith(
			["en-US", "en", "ja"],
			LOCALE_VALUES,
			DEFAULT_LOCALE,
		);
	});

	it("should handle multiple languages in Accept-Language header", async () => {
		// 複数言語の優先順位処理
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue("fr;q=0.9,jp;q=0.8,en;q=0.7"),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);
		mockedMatchLocale.mockReturnValue("jp");

		const locale = await negotiateLocale();
		expect(locale).toBe("jp");
		expect(mockedMatchLocale).toHaveBeenCalledWith(
			["fr", "jp", "en"],
			LOCALE_VALUES,
			DEFAULT_LOCALE,
		);
	});

	it("should return default locale when no valid locale found", async () => {
		// 無効なロケールのみの場合、DEFAULT_LOCALE（jp）を返す
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue("fr,de,es"),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);
		mockedMatchLocale.mockReturnValue("jp"); // デフォルトロケールを返す

		const locale = await negotiateLocale();
		expect(locale).toBe("jp");
	});

	it("should return default locale when Accept-Language header is missing", async () => {
		// ヘッダーが存在しない場合のフォールバック
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue(null),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);

		const locale = await negotiateLocale();
		expect(locale).toBe(DEFAULT_LOCALE);
	});

	it("should handle malformed Accept-Language header", async () => {
		// 不正な形式のヘッダー処理
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue("invalid-header-format"),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);
		mockedMatchLocale.mockReturnValue("jp");

		const locale = await negotiateLocale();
		expect(locale).toBe("jp");
		expect(mockedMatchLocale).toHaveBeenCalledWith(
			["invalid-header-format"],
			LOCALE_VALUES,
			DEFAULT_LOCALE,
		);
	});

	it("should handle empty Accept-Language header", async () => {
		// 空のヘッダー処理
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		const mockHeaderStore = {
			get: jest.fn().mockReturnValue(""),
		};

		mockedCookies.mockResolvedValue(mockCookieStore as MockCookieStore);
		mockedHeaders.mockResolvedValue(mockHeaderStore as MockHeaderStore);

		const locale = await negotiateLocale();
		expect(locale).toBe(DEFAULT_LOCALE);
	});
});

// getRequestConfigの統合テストはE2Eテストで実行されるため、
// ここではnegotiateLocaleの単体テストのみ実装
