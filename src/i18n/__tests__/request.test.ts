import { DEFAULT_LOCALE, LOCALE_VALUES, LOCALES } from "../config";
import { determineLocale } from "../request";

// resolveAcceptLanguage関数のモック
const mockResolveLanguage = jest.fn();

describe("determineLocale", () => {
	beforeEach(() => {
		mockResolveLanguage.mockReset();
	});

	describe("Cookieロケールの優先度テスト", () => {
		it("有効なcookieLocaleが渡された場合、それを返すこと", () => {
			const result = determineLocale(
				LOCALES.EN,
				"ja,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("有効なcookieLocale(jp)が渡された場合、それを返すこと", () => {
			const result = determineLocale(
				LOCALES.JP,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("無効なcookieLocaleが渡された場合、無視されること", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result = determineLocale(
				"invalid-locale",
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("cookieLocaleがundefinedの場合、他の判定に進むこと", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result = determineLocale(
				undefined,
				"ja,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"ja,en;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("cookieLocaleが空文字列の場合、他の判定に進むこと", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result = determineLocale("", "en,ja;q=0.9", mockResolveLanguage);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("Accept-Languageヘッダーの処理テスト", () => {
		it("acceptHeaderがnullの場合、DEFAULT_LOCALEを返すこと", () => {
			const result = determineLocale(undefined, null, mockResolveLanguage);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("有効なaccept-languageヘッダーが渡された場合、適切にマッチングされること", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result = determineLocale(
				undefined,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("複数の言語が指定された場合、優先度に従って処理されること", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result = determineLocale(
				undefined,
				"fr;q=0.8,ja;q=0.9,en;q=0.7",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"fr;q=0.8,ja;q=0.9,en;q=0.7",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("サポートされていない言語の場合、DEFAULT_LOCALEを返すこと", () => {
			mockResolveLanguage.mockReturnValue("fr"); // サポートされていない言語
			const result = determineLocale(
				undefined,
				"fr,de;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"fr,de;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("resolveLanguage関数のモック化", () => {
		it("resolveLanguageが無効な値を返した場合、DEFAULT_LOCALEを返すこと", () => {
			mockResolveLanguage.mockReturnValue("invalid-locale");
			const result = determineLocale(
				undefined,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("resolveLanguageがnullを返した場合、DEFAULT_LOCALEを返すこと", () => {
			mockResolveLanguage.mockReturnValue(null);
			const result = determineLocale(
				undefined,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("resolveLanguageがundefinedを返した場合、DEFAULT_LOCALEを返すこと", () => {
			mockResolveLanguage.mockReturnValue(undefined);
			const result = determineLocale(
				undefined,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"en,ja;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});

	describe("エッジケースのテスト", () => {
		it("空文字列のacceptHeaderが渡された場合の処理", () => {
			// 空文字列は falsy なので早期にDEFAULT_LOCALEが返される
			const result = determineLocale(undefined, "", mockResolveLanguage);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("予期しないcookieLocale値が渡された場合の処理", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result = determineLocale("123", "ja,en;q=0.9", mockResolveLanguage);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"ja,en;q=0.9",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("isLocale関数との連携が正しく動作すること - 有効なロケール", () => {
			// cookieLocaleが有効な場合
			const result1 = determineLocale(
				LOCALES.EN,
				"ja,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result1).toBe(LOCALES.EN);

			// resolveLanguageが有効なロケールを返す場合
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result2 = determineLocale(
				undefined,
				"ja,en;q=0.9",
				mockResolveLanguage,
			);
			expect(result2).toBe(LOCALES.JP);
		});

		it("isLocale関数との連携が正しく動作すること - 無効なロケール", () => {
			// cookieLocaleが無効な場合
			mockResolveLanguage.mockReturnValue(LOCALES.EN);
			const result1 = determineLocale(
				"invalid",
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result1).toBe(LOCALES.EN);

			// resolveLanguageが無効なロケールを返す場合
			mockResolveLanguage.mockReturnValue("invalid");
			const result2 = determineLocale(
				undefined,
				"en,ja;q=0.9",
				mockResolveLanguage,
			);
			expect(result2).toBe(DEFAULT_LOCALE);
		});
	});

	describe("resolveLanguage関数自体の動作テスト", () => {
		it("実際のresolveAcceptLanguage関数で空の場合にデフォルトロケールが返されること", () => {
			const result = determineLocale(undefined, "");

			// 空文字列の場合、早期にデフォルトロケールが返される
			expect(result).toBe(DEFAULT_LOCALE);
		});

		it("実際のresolveAcceptLanguage関数でnullの場合にデフォルトロケールが返されること", () => {
			const result = determineLocale(undefined, null);

			// nullの場合、早期にデフォルトロケールが返される
			expect(result).toBe(DEFAULT_LOCALE);
		});
	});

	describe("統合テストケース", () => {
		it("cookieLocale優先、acceptHeaderは無視される", () => {
			const result = determineLocale(
				LOCALES.EN,
				"ja,fr;q=0.9",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.EN);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("cookieLocaleが無効、acceptHeaderから正常にロケールを決定", () => {
			mockResolveLanguage.mockReturnValue(LOCALES.JP);
			const result = determineLocale(
				"invalid",
				"ja,en;q=0.8",
				mockResolveLanguage,
			);
			expect(result).toBe(LOCALES.JP);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"ja,en;q=0.8",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});

		it("cookieLocaleが無効、acceptHeaderもnull、デフォルトロケールを返す", () => {
			const result = determineLocale("invalid", null, mockResolveLanguage);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).not.toHaveBeenCalled();
		});

		it("全ての条件が失敗した場合、最終的にデフォルトロケールを返す", () => {
			mockResolveLanguage.mockReturnValue("invalid-resolved");
			const result = determineLocale(
				"invalid-cookie",
				"invalid-header",
				mockResolveLanguage,
			);
			expect(result).toBe(DEFAULT_LOCALE);
			expect(mockResolveLanguage).toHaveBeenCalledWith(
				"invalid-header",
				LOCALE_VALUES,
				DEFAULT_LOCALE,
			);
		});
	});
});
