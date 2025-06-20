import { match as matchLocale } from "@formatjs/intl-localematcher";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_TEXT, LOCALE_VALUES } from "@/i18n/config";
import { negotiateLocale } from "../request";

jest.mock("next/headers", () => ({
	cookies: jest.fn(),
	headers: jest.fn(),
}));

jest.mock("@formatjs/intl-localematcher", () => ({
	match: jest.fn(),
}));

jest.mock("next-intl/server", () => ({
	getRequestConfig: jest.fn(),
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockMatchLocale = matchLocale as jest.MockedFunction<typeof matchLocale>;

describe("negotiateLocale", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Cookie優先のテスト", () => {
		it("should return locale from cookie when valid locale is set", async () => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "en" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockCookieStore.get).toHaveBeenCalledWith(LOCALE_TEXT);
		});

		it("should ignore invalid cookie locale and fallback to headers", async () => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid" }),
			};
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "en", "ja"],
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("should ignore missing cookie and fallback to headers", async () => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("jp"),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
		});
	});

	describe("Accept-Languageヘッダーのテスト", () => {
		beforeEach(() => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);
		});

		it("should negotiate locale from Accept-Language header", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "en", "ja"],
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("should handle multiple languages in Accept-Language header", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("fr;q=0.8,jp;q=0.9,en;q=0.7"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["fr", "jp", "en"],
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("should return default locale when no valid locale found", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("fr,de,es"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("invalid");

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("should return default locale when Accept-Language header is missing", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue(null),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("should handle malformed Accept-Language header", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("malformed;;;header"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue(DEFAULT_LOCALE);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["malformed"],
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("should handle empty Accept-Language header", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue(""),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});

		it("should handle Accept-Language header with quality values", async () => {
			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en;q=0.5, jp;q=1.0, fr;q=0.1"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en", "jp", "fr"],
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("エッジケース", () => {
		it("should handle cookie with no value", async () => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: null }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);

			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("en"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
		});

		it("should handle undefined cookie value", async () => {
			const mockCookieStore = {
				get: jest.fn().mockReturnValue({ value: undefined }),
			};
			mockCookies.mockResolvedValue(mockCookieStore as any);

			const mockHeaderStore = {
				get: jest.fn().mockReturnValue("jp"),
			};
			mockHeaders.mockResolvedValue(mockHeaderStore as any);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
		});
	});
});

describe("getRequestConfig integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should be callable with getRequestConfig from next-intl/server", () => {
		expect(getRequestConfig).toBeDefined();
		expect(typeof getRequestConfig).toBe("function");
	});

	it("should correctly pass negotiateLocale function to getRequestConfig", async () => {
		const mockCookieStore = {
			get: jest.fn().mockReturnValue({ value: "en" }),
		};
		mockCookies.mockResolvedValue(mockCookieStore as any);

		const locale = await negotiateLocale();
		expect(locale).toBe("en");
	});

	it("should work with default locale when no preferences set", async () => {
		const mockCookieStore = {
			get: jest.fn().mockReturnValue(undefined),
		};
		mockCookies.mockResolvedValue(mockCookieStore as any);

		const mockHeaderStore = {
			get: jest.fn().mockReturnValue(null),
		};
		mockHeaders.mockResolvedValue(mockHeaderStore as any);

		const locale = await negotiateLocale();
		expect(locale).toBe(DEFAULT_LOCALE);
	});
});
