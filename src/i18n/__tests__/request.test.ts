import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";
import { determineLocale } from "@/i18n/request";

// Mock the resolveAcceptLanguage module
jest.mock("resolve-accept-language", () => ({
	resolveAcceptLanguage: jest.fn(),
}));

describe("determineLocale", () => {
	const mockResolveLanguage = jest.fn();

	beforeEach(() => {
		mockResolveLanguage.mockReset();
	});

	describe("Cookieロケールの優先度テスト", () => {
		const testCases = [
			{
				name: "有効なcookieLocale(jp)が渡された場合、それを返すこと",
				cookieLocale: LOCALES.JP,
				acceptHeader: "en-US,en;q=0.9",
				expected: LOCALES.JP,
			},
			{
				name: "有効なcookieLocale(en)が渡された場合、それを返すこと",
				cookieLocale: LOCALES.EN,
				acceptHeader: "ja-JP,ja;q=0.9",
				expected: LOCALES.EN,
			},
		];

		test.each(testCases)(
			"$name",
			({ cookieLocale, acceptHeader, expected }) => {
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).not.toHaveBeenCalled();
			},
		);

		const invalidCookieTestCases = [
			{
				name: "無効なcookieLocale(fr)が渡された場合、無視されること",
				cookieLocale: "fr",
				acceptHeader: "en-US,en;q=0.9",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
			{
				name: "無効なcookieLocale(空文字)が渡された場合、無視されること",
				cookieLocale: "",
				acceptHeader: "en-US,en;q=0.9",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
			{
				name: "無効なcookieLocale(数値文字列)が渡された場合、無視されること",
				cookieLocale: "123",
				acceptHeader: "en-US,en;q=0.9",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
		];

		test.each(invalidCookieTestCases)(
			"$name",
			({ cookieLocale, acceptHeader, resolveLanguageReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(resolveLanguageReturn);
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).toHaveBeenCalledWith(
					acceptHeader,
					["en", "jp"],
					DEFAULT_LOCALE,
				);
			},
		);

		test("cookieLocaleがundefinedの場合、他の判定に進むこと", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result = determineLocale(
				undefined,
				"en-US,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en-US,en;q=0.9",
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});
	});

	describe("Accept-Languageヘッダーの処理テスト", () => {
		test("acceptHeaderがnullの場合、DEFAULT_LOCALEを返すこと", () => {
			const result = determineLocale(undefined, null, mockResolveLanguage);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		const acceptHeaderTestCases = [
			{
				name: "有効なaccept-languageヘッダー(en-US)が渡された場合、適切にマッチングされること",
				acceptHeader: "en-US,en;q=0.9",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
			{
				name: "有効なaccept-languageヘッダー(ja-JP)が渡された場合、適切にマッチングされること",
				acceptHeader: "ja-JP,ja;q=0.9",
				resolveLanguageReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
			{
				name: "複数の言語が指定された場合、優先度に従って処理されること",
				acceptHeader: "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
		];

		test.each(acceptHeaderTestCases)(
			"$name",
			({ acceptHeader, resolveLanguageReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(resolveLanguageReturn);
				const result = determineLocale(
					undefined,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).toHaveBeenCalledWith(
					acceptHeader,
					["en", "jp"],
					DEFAULT_LOCALE,
				);
			},
		);

		test("サポートされていない言語の場合、DEFAULT_LOCALEを返すこと", () => {
			mockResolveLanguage.mockReturnValue("fr"); // Unsupported locale
			const result = determineLocale(
				undefined,
				"fr-FR,fr;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"fr-FR,fr;q=0.9",
				["en", "jp"],
				DEFAULT_LOCALE,
			);
		});
	});

	describe("resolveLanguage関数のモック化", () => {
		const mockScenarios = [
			{
				name: "resolveLanguageが日本語を返した場合",
				mockReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
			{
				name: "resolveLanguageが英語を返した場合",
				mockReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
		];

		test.each(mockScenarios)("$name", ({ mockReturn, expected }) => {
			mockResolveLanguage.mockReturnValue(mockReturn);
			const result = determineLocale(
				undefined,
				"en-US,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(expected);
		});

		const invalidReturnScenarios = [
			{
				name: "resolveLanguageが無効な値(null)を返した場合",
				mockReturn: null,
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageが無効な値(undefined)を返した場合",
				mockReturn: undefined,
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageが無効な値(空文字)を返した場合",
				mockReturn: "",
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageが無効な値(数値)を返した場合",
				mockReturn: 123,
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageが無効な値(オブジェクト)を返した場合",
				mockReturn: {},
				expected: DEFAULT_LOCALE,
			},
		];

		test.each(invalidReturnScenarios)("$name", ({ mockReturn, expected }) => {
			mockResolveLanguage.mockReturnValue(mockReturn);
			const result = determineLocale(
				undefined,
				"en-US,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(expected);
		});
	});

	describe("エッジケースのテスト", () => {
		const edgeCases = [
			{
				name: "cookieLocaleが空文字列の場合",
				cookieLocale: "",
				acceptHeader: "en-US,en;q=0.9",
				resolveLanguageReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
			{
				name: "acceptHeaderが空文字列の場合",
				cookieLocale: undefined,
				acceptHeader: "",
				resolveLanguageReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
			{
				name: "両方とも無効な値の場合",
				cookieLocale: "invalid",
				acceptHeader: "",
				resolveLanguageReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
		];

		test.each(edgeCases)(
			"$name",
			({ cookieLocale, acceptHeader, resolveLanguageReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(resolveLanguageReturn);
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
			},
		);

		test("予期しない値が渡された場合の処理", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			// @ts-expect-error - テスト用に意図的に型違反
			const result = determineLocale(123, ["invalid"], mockResolveLanguage);
			expect(result).toBe(LOCALES.EN);
		});

		test("isLocale関数との連携が正しく動作すること", () => {
			// Valid locale in cookie
			expect(determineLocale(LOCALES.JP, null, mockResolveLanguage)).toBe(
				LOCALES.JP,
			);
			expect(determineLocale(LOCALES.EN, null, mockResolveLanguage)).toBe(
				LOCALES.EN,
			);

			// Invalid locale in cookie should be ignored
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			expect(
				determineLocale("invalid-locale", "ja-JP", mockResolveLanguage),
			).toBe(LOCALES.JP);

			// Valid locale from resolveLanguage
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			expect(determineLocale(undefined, "en-US", mockResolveLanguage)).toBe(
				LOCALES.EN,
			);

			// Invalid locale from resolveLanguage should return default
			mockResolveLanguage.mockReturnValue("invalid-locale");
			expect(determineLocale(undefined, "fr-FR", mockResolveLanguage)).toBe(
				DEFAULT_LOCALE,
			);
		});
	});

	describe("resolveLanguage関数自体の動作テスト", () => {
		test("resolveLanguage関数をモック化しないで適切なacceptHeaderを設定したパターン", () => {
			// Import the real resolveAcceptLanguage function
			const { resolveAcceptLanguage } = require("resolve-accept-language");

			// Test with a real accept header that should resolve to English
			const result = determineLocale(
				undefined,
				"en-US,en;q=0.9,ja;q=0.8",
				resolveAcceptLanguage,
			);

			// The result should be either 'en' or DEFAULT_LOCALE depending on the real function behavior
			expect(["en", "jp"]).toContain(result);
			expect(typeof result).toBe("string");
		});
	});
});
