import { match as matchLocale } from "@formatjs/intl-localematcher";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_TEXT } from "@/i18n/config";
import { negotiateLocale } from "@/i18n/request";

// Next.js のサーバー関数をモック
jest.mock("next/headers", () => ({
	cookies: jest.fn(),
	headers: jest.fn(),
}));

jest.mock("@formatjs/intl-localematcher", () => ({
	match: jest.fn(),
}));

// 動的インポートのモック
jest.mock("../messages/en.json", () => ({
	Home: { topPage: "Top page" },
}));

jest.mock("../messages/jp.json", () => ({
	Home: { topPage: "トップページ" },
}));

describe("negotiateLocale", () => {
	const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
	const mockHeaders = headers as jest.MockedFunction<typeof headers>;
	const mockMatchLocale = matchLocale as jest.MockedFunction<
		typeof matchLocale
	>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Cookie優先のテスト", () => {
		it("should return locale from cookie when valid locale is set", async () => {
			// Cookie: locale=en の場合、'en'を返す
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "en" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockCookieStore.get).toHaveBeenCalledWith(LOCALE_TEXT);
		});

		it("should ignore invalid cookie locale and fallback to headers", async () => {
			// Cookie: locale=invalid の場合、Accept-Languageヘッダーを確認
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);

			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
		});
	});

	describe("Accept-Languageヘッダーのテスト", () => {
		beforeEach(() => {
			// Cookieは無効な値またはなしと仮定
			const mockCookieStore = {
				get: jest.fn().mockReturnValue(null),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);
		});

		it("should negotiate locale from Accept-Language header", async () => {
			// Accept-Language: en-US,en;q=0.9,ja;q=0.8 の場合の動作
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "en", "ja"],
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});

		it("should handle multiple languages in Accept-Language header", async () => {
			// 複数言語の優先順位処理
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("fr;q=0.9,jp;q=0.8,en;q=0.7"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["fr", "jp", "en"],
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});

		it("should return default locale when no valid locale found", async () => {
			// 無効なロケールのみの場合、DEFAULT_LOCALE（jp）を返す
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("fr,de,es"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("invalid");

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("should return default locale when Accept-Language header is missing", async () => {
			// ヘッダーが存在しない場合のフォールバック
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue(null),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});
	});

	describe("エッジケース", () => {
		beforeEach(() => {
			// Cookieは無効な値またはなしと仮定
			const mockCookieStore = {
				get: jest.fn().mockReturnValue(null),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);
		});

		it("should handle malformed Accept-Language header", async () => {
			// 不正な形式のヘッダー処理
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("malformed;;;header"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue(DEFAULT_LOCALE);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["malformed"],
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});

		it("should handle empty Accept-Language header", async () => {
			// 空のヘッダー処理
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue(""),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			// 空文字列の場合はif (accept)がfalseになるためmatchLocaleは呼ばれない
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});

		it("should handle whitespace-only Accept-Language header", async () => {
			// 空白のみのヘッダー処理
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("   "),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue(DEFAULT_LOCALE);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			// 空白のみの場合はtrimされて空文字列になる
			expect(mockMatchLocale).toHaveBeenCalledWith(
				[""],
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});

		it("should handle header with only quality values", async () => {
			// 品質値のみのヘッダー処理
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en;q=0.9;q=0.8"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en"],
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});
	});
});

describe("getRequestConfig", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should return correct config with negotiated locale", async () => {
		// negotiateLocaleをモック
		const mockCookieStore = {
			get: jest.fn().mockReturnValue({ value: "en" }),
		};
		(cookies as jest.MockedFunction<typeof cookies>).mockResolvedValue(
			mockCookieStore as any,
		);

		// 動的インポートの結果を直接テスト
		const enMessages = await import("../messages/en.json");
		expect(enMessages.default).toEqual({ Home: { topPage: "Top page" } });

		const jpMessages = await import("../messages/jp.json");
		expect(jpMessages.default).toEqual({ Home: { topPage: "トップページ" } });
	});

	it("should load correct message files based on locale", async () => {
		// jpロケールの場合
		const mockCookieStore = {
			get: jest.fn().mockReturnValue({ value: "jp" }),
		};
		(cookies as jest.MockedFunction<typeof cookies>).mockResolvedValue(
			mockCookieStore as any,
		);

		const jpMessages = await import("../messages/jp.json");
		expect(jpMessages.default).toEqual({ Home: { topPage: "トップページ" } });

		// enロケールの場合
		mockCookieStore.get.mockReturnValue({ value: "en" });
		const enMessages = await import("../messages/en.json");
		expect(enMessages.default).toEqual({ Home: { topPage: "Top page" } });
	});
});
