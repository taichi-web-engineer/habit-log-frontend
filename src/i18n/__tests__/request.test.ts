import { match as matchLocale } from "@formatjs/intl-localematcher";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE } from "../config";
import { negotiateLocale } from "../request";

jest.mock("next/headers", () => ({
	cookies: jest.fn(),
	headers: jest.fn(),
}));

jest.mock("@formatjs/intl-localematcher", () => ({
	match: jest.fn(),
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockHeaders = headers as jest.MockedFunction<typeof headers>;
const mockMatchLocale = matchLocale as jest.MockedFunction<typeof matchLocale>;

type MockCookieStore = {
	get: jest.Mock<{ value: string } | undefined, [key: string]>;
};

type MockHeaderStore = {
	get: jest.Mock<string | null, [key: string]>;
};

describe("negotiateLocale", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Cookie優先のテスト", () => {
		it("should return locale from cookie when valid locale is set", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "en" }),
			};
			mockCookies.mockResolvedValue(mockCookieStore);

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockCookieStore.get).toHaveBeenCalledWith("locale");
		});

		it("should ignore invalid cookie locale and fallback to headers", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
			};

			mockCookies.mockResolvedValue(mockCookieStore);
			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "en", "ja"],
				["en", "jp"],
				"jp",
			);
		});

		it("should ignore cookie when value is undefined", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("jp;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore);
			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockHeaderStore.get).toHaveBeenCalledWith("accept-language");
		});
	});

	describe("Accept-Languageヘッダーのテスト", () => {
		beforeEach(() => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue(undefined),
			};
			mockCookies.mockResolvedValue(mockCookieStore);
		});

		it("should negotiate locale from Accept-Language header", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9,ja;q=0.8"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "en", "ja"],
				["en", "jp"],
				"jp",
			);
		});

		it("should handle multiple languages in Accept-Language header", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("ja-JP,ja;q=0.9,en;q=0.8,zh;q=0.7"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["ja-JP", "ja", "en", "zh"],
				["en", "jp"],
				"jp",
			);
		});

		it("should return default locale when no valid locale found", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("fr-FR,de;q=0.9"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("invalid");

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("should return default locale when Accept-Language header is missing", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue(null),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});

		it("should handle malformed Accept-Language header", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("malformed;;;header"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["malformed"],
				["en", "jp"],
				"jp",
			);
		});

		it("should handle empty Accept-Language header", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue(""),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});

		it("should handle Accept-Language header with quality values", async () => {
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US;q=0.8,jp;q=0.9,fr;q=0.7"),
			};

			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("jp");

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockMatchLocale).toHaveBeenCalledWith(
				["en-US", "jp", "fr"],
				["en", "jp"],
				"jp",
			);
		});
	});

	describe("エッジケース", () => {
		it("should handle when both cookie and header are invalid", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "invalid-locale" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("fr-FR,de;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore);
			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("unsupported");

			const result = await negotiateLocale();

			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("should handle empty cookie value", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US"),
			};

			mockCookies.mockResolvedValue(mockCookieStore);
			mockHeaders.mockResolvedValue(mockHeaderStore);
			mockMatchLocale.mockReturnValue("en");

			const result = await negotiateLocale();

			expect(result).toBe("en");
		});

		it("should prioritize cookie over header when both are valid", async () => {
			const mockCookieStore: MockCookieStore = {
				get: jest.fn().mockReturnValue({ value: "jp" }),
			};
			const mockHeaderStore: MockHeaderStore = {
				get: jest.fn().mockReturnValue("en-US,en;q=0.9"),
			};

			mockCookies.mockResolvedValue(mockCookieStore);
			mockHeaders.mockResolvedValue(mockHeaderStore);

			const result = await negotiateLocale();

			expect(result).toBe("jp");
			expect(mockHeaders).not.toHaveBeenCalled();
			expect(mockMatchLocale).not.toHaveBeenCalled();
		});
	});
});

describe("getRequestConfig integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should export default getRequestConfig function", () => {
		const requestModule = require("../request");
		expect(typeof requestModule.default).toBe("function");
	});

	it("should be able to import message files dynamically", async () => {
		const enMessages = await import("../messages/en.json");
		const jpMessages = await import("../messages/jp.json");

		expect(enMessages.default).toBeDefined();
		expect(jpMessages.default).toBeDefined();
		expect(typeof enMessages.default).toBe("object");
		expect(typeof jpMessages.default).toBe("object");
	});

	it("should have proper message structure", async () => {
		const enMessages = await import("../messages/en.json");
		const jpMessages = await import("../messages/jp.json");

		expect(enMessages.default.Home).toBeDefined();
		expect(jpMessages.default.Home).toBeDefined();
		expect(enMessages.default.Home.topPage).toBe("Top page");
		expect(jpMessages.default.Home.topPage).toBe("トップページ");
	});
});
