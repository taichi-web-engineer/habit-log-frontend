import { DEFAULT_LOCALE, LOCALE_VALUES, LOCALES } from "@/i18n/config";
import { determineLocale } from "@/i18n/request";

describe("determineLocale", () => {
	const mockResolveLanguage = jest.fn();

	beforeEach(() => {
		mockResolveLanguage.mockReset();
	});

	describe("Cookieロケールの優先度テスト", () => {
		const testCases = [
			{
				name: "有効なcookieLocaleが渡された場合、それを返す",
				cookieLocale: LOCALES.EN,
				acceptHeader: "ja,en;q=0.9",
				expected: LOCALES.EN,
			},
			{
				name: "有効なcookieLocale(jp)が渡された場合、それを返す",
				cookieLocale: LOCALES.JP,
				acceptHeader: "en,ja;q=0.9",
				expected: LOCALES.JP,
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
				name: "無効なcookieLocaleが渡された場合、無視される",
				cookieLocale: "invalid",
				acceptHeader: "ja,en;q=0.9",
				mockReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
			{
				name: "cookieLocaleがundefinedの場合、他の判定に進む",
				cookieLocale: undefined,
				acceptHeader: "ja,en;q=0.9",
				mockReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
			{
				name: "cookieLocaleが空文字列の場合、他の判定に進む",
				cookieLocale: "",
				acceptHeader: "ja,en;q=0.9",
				mockReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
		];

		test.each(invalidCookieTestCases)(
			"$name",
			({ cookieLocale, acceptHeader, mockReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(mockReturn);
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).toHaveBeenCalledWith(
					acceptHeader,
					LOCALE_VALUES,
					DEFAULT_LOCALE,
				);
			},
		);
	});

	describe("Accept-Languageヘッダーの処理テスト", () => {
		const testCases = [
			{
				name: "acceptHeaderがnullの場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: null,
				expected: DEFAULT_LOCALE,
			},
			{
				name: "acceptHeaderがundefinedの場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: undefined as unknown as null,
				expected: DEFAULT_LOCALE,
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

		const validHeaderTestCases = [
			{
				name: "有効なaccept-languageヘッダーが渡された場合、適切にマッチングされる(en)",
				cookieLocale: undefined,
				acceptHeader: "en,ja;q=0.9",
				mockReturn: LOCALES.EN,
				expected: LOCALES.EN,
			},
			{
				name: "有効なaccept-languageヘッダーが渡された場合、適切にマッチングされる(jp)",
				cookieLocale: undefined,
				acceptHeader: "ja,en;q=0.9",
				mockReturn: LOCALES.JP,
				expected: LOCALES.JP,
			},
		];

		test.each(validHeaderTestCases)(
			"$name",
			({ cookieLocale, acceptHeader, mockReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(mockReturn);
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).toHaveBeenCalledWith(
					acceptHeader,
					LOCALE_VALUES,
					DEFAULT_LOCALE,
				);
			},
		);

		test("サポートされていない言語の場合、DEFAULT_LOCALEを返す", () => {
			mockResolveLanguage.mockReturnValue("fr");
			const result = determineLocale(
				undefined,
				"fr,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"fr,en;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("resolveLanguage関数のモック化テスト", () => {
		const mockTestCases = [
			{
				name: "resolveLanguageが無効な値を返した場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: "invalid,en;q=0.9",
				mockReturn: "invalid",
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageがnullを返した場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: "en,ja;q=0.9",
				mockReturn: null,
				expected: DEFAULT_LOCALE,
			},
			{
				name: "resolveLanguageがundefinedを返した場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: "en,ja;q=0.9",
				mockReturn: undefined,
				expected: DEFAULT_LOCALE,
			},
		];

		test.each(mockTestCases)(
			"$name",
			({ cookieLocale, acceptHeader, mockReturn, expected }) => {
				mockResolveLanguage.mockReturnValue(mockReturn);
				const result = determineLocale(
					cookieLocale,
					acceptHeader,
					mockResolveLanguage,
				);
				expect(result).toBe(expected);
				expect(mockResolveLanguage).toHaveBeenCalledWith(
					acceptHeader,
					LOCALE_VALUES,
					DEFAULT_LOCALE,
				);
			},
		);
	});

	describe("エッジケースのテスト", () => {
		const edgeCaseTestCases = [
			{
				name: "空文字列のacceptHeaderが渡された場合、DEFAULT_LOCALEを返す",
				cookieLocale: undefined,
				acceptHeader: "",
				expected: DEFAULT_LOCALE,
			},
			{
				name: "異常な値のacceptHeaderが渡された場合、適切に処理される",
				cookieLocale: undefined,
				acceptHeader: "invalid-header-format",
				mockReturn: DEFAULT_LOCALE,
				expected: DEFAULT_LOCALE,
			},
		];

		test("空文字列のacceptHeaderが渡された場合、DEFAULT_LOCALEを返す", () => {
			const result = determineLocale(undefined, "", mockResolveLanguage);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		test("異常な値のacceptHeaderが渡された場合、適切に処理される", () => {
			mockResolveLanguage.mockReturnValue(DEFAULT_LOCALE);
			const result = determineLocale(
				undefined,
				"invalid-header-format",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"invalid-header-format",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("resolveLanguage関数の統合テスト", () => {
		test("resolveLanguage関数が正常に呼び出され、適切な値でマッチングが行われること", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result = determineLocale(
				undefined,
				"en-US,ja-JP;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en-US,ja-JP;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		test("resolveLanguage関数が複数のロケールを処理できること", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result = determineLocale(
				undefined,
				"ja-JP,en-US;q=0.8,fr-FR;q=0.5",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"ja-JP,en-US;q=0.8,fr-FR;q=0.5",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});
});
