import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies, headers } from "next/headers";
import { resolveAcceptLanguage } from "resolve-accept-language";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { negotiateLocale } from "@/i18n/request";

jest.mock("next/headers");
jest.mock("resolve-accept-language");

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockResolveAcceptLanguage = resolveAcceptLanguage as jest.MockedFunction<
	typeof resolveAcceptLanguage
>;

type MockCookieStore = Pick<ReadonlyRequestCookies, "get">;
type MockHeaderStore = Pick<Headers, "get">;

describe("negotiateLocale", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Cookie値のテストケース", () => {
		it("Cookie有効値テスト: Cookie に 'en' が設定されている場合、'en' を返す", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "en" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockCookieStore.get).toHaveBeenCalledWith("locale");
		});

		it("Cookie有効値テスト: Cookie に 'jp' が設定されている場合、'jp' を返す", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "jp" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockCookieStore.get).toHaveBeenCalledWith("locale");
		});

		it("Cookie無効値テスト: Cookie に無効な値が設定されている場合、Accept-Languageヘッダーの処理に移る", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);
			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"en-US,en;q=0.9",
				["en", "jp"],
				"jp",
			);
		});

		it("Cookie未設定テスト: Cookieが存在しない場合、Accept-Languageヘッダーの処理に移る", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("ja,jp;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);
			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"ja,jp;q=0.9",
				["en", "jp"],
				"jp",
			);
		});
	});

	describe("Accept-Languageヘッダーのテストケース", () => {
		beforeEach(() => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);
		});

		it("ヘッダー有効値テスト: Accept-Language が 'en-US,en;q=0.9' の場合、'en' を返す", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"en-US,en;q=0.9",
				["en", "jp"],
				"jp",
			);
		});

		it("ヘッダー有効値テスト: Accept-Language が 'ja,jp;q=0.9' の場合、'jp' を返す", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("ja,jp;q=0.9"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"ja,jp;q=0.9",
				["en", "jp"],
				"jp",
			);
		});

		it("ヘッダー無効値テスト: Accept-Language が無効/未対応言語の場合、デフォルトロケール 'jp' を返す", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("fr-FR,fr;q=0.9"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("unsupported");

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"fr-FR,fr;q=0.9",
				["en", "jp"],
				"jp",
			);
		});

		it("ヘッダー未設定テスト: Accept-Languageヘッダーが存在しない場合、デフォルトロケール 'jp' を返す", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue(null),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"",
				["en", "jp"],
				"jp",
			);
		});
	});

	describe("複合条件のテストケース", () => {
		it("Cookie優先テスト: CookieとAccept-Language両方が設定されている場合、Cookieの値が優先される", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "en" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("ja,jp;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);
			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).not.toHaveBeenCalled();
			expect(mockResolveAcceptLanguage).not.toHaveBeenCalled();
		});

		it("Cookie無効時のフォールバック: Cookie値が無効でAccept-Languageが有効な場合、Accept-Languageの値を使用", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore as ReadonlyRequestCookies);
			mockHeaders.mockResolvedValue(mockHeaderStore as Headers);
			mockResolveAcceptLanguage.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
			expect(mockResolveAcceptLanguage).toHaveBeenCalledWith(
				"en-US,en;q=0.9",
				["en", "jp"],
				"jp",
			);
		});
	});
});
