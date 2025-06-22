import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";
import { determineLocale } from "@/i18n/request";

type TestCase = readonly [string, string | undefined, string | null, string];

const testCases = [
	// 正常系: cookieLocale が有効な場合
	[
		"cookieLocale: LOCALES.EN",
		LOCALES.EN,
		"ja-JP,ja;q=0.9,en;q=0.8",
		LOCALES.EN,
	],
	[
		"cookieLocale: LOCALES.JA",
		LOCALES.JA,
		"en-US,en;q=0.9,ja;q=0.8",
		LOCALES.JA,
	],

	// 正常系: cookieLocale が無効、headerAcceptLanguage が無効
	[
		"cookieLocale: undefined, headerAcceptLanguage: null",
		undefined,
		null,
		DEFAULT_LOCALE,
	],

	// 正常系: cookieLocale が無効、headerAcceptLanguage が有効（日本語）
	[
		"cookieLocale: undefined, headerAcceptLanguage: 日本語",
		undefined,
		"ja-JP,ja;q=0.9,en;q=0.8",
		LOCALES.JA,
	],
	[
		"cookieLocale: undefined, headerAcceptLanguage: 日本語優先",
		undefined,
		"ja-JP,en-US;q=0.5",
		LOCALES.JA,
	],

	// 正常系: cookieLocale が無効、headerAcceptLanguage が有効（英語）
	[
		"cookieLocale: undefined, headerAcceptLanguage: 英語",
		undefined,
		"en-US,en;q=0.9,ja;q=0.8",
		LOCALES.EN,
	],
	[
		"cookieLocale: undefined, headerAcceptLanguage: 英語優先",
		undefined,
		"en-US,ja-JP;q=0.5",
		LOCALES.EN,
	],

	// エッジケース: 想定外のcookieLocale
	["想定外のcookieLocale: 空文字", "", "ja-JP,ja;q=0.9", LOCALES.JA],
	[
		"想定外のcookieLocale: 無効な文字列",
		"invalid-locale",
		"ja-JP,ja;q=0.9",
		LOCALES.JA,
	],
	["想定外のcookieLocale: 数値文字列", "123", "en-US,en;q=0.9", LOCALES.EN],

	// エッジケース: 想定外のheaderAcceptLanguage
	["想定外のheaderAcceptLanguage: 空文字", undefined, "", DEFAULT_LOCALE],
	[
		"想定外のheaderAcceptLanguage: 無効な形式",
		undefined,
		"invalid-header",
		DEFAULT_LOCALE,
	],
	["想定外のheaderAcceptLanguage: 数値", undefined, "123", DEFAULT_LOCALE],

	// エッジケース: 地域サブタグ付きheaderAcceptLanguage
	["地域サブタグ付き: ja-JP,en-GB", undefined, "ja-JP,en-GB;q=0.8", LOCALES.JA],
	["地域サブタグ付き: en-GB,ja-JP", undefined, "en-GB,ja-JP;q=0.8", LOCALES.JA],
	["地域サブタグ付き: fr-FR,ja-JP", undefined, "fr-FR,ja-JP;q=0.8", LOCALES.JA],

	// エッジケース: 複雑な組み合わせ
	[
		"無効cookieLocale + 無効headerAcceptLanguage",
		"invalid",
		"invalid-header",
		DEFAULT_LOCALE,
	],
	[
		"無効cookieLocale + null headerAcceptLanguage",
		"invalid",
		null,
		DEFAULT_LOCALE,
	],
	["空文字cookieLocale + 空文字headerAcceptLanguage", "", "", DEFAULT_LOCALE],
] satisfies readonly TestCase[];

describe("determineLocale", () => {
	test.each(testCases)(
		"%s",
		(_, cookieLocale, headerAcceptLanguage, expected) => {
			expect(determineLocale(cookieLocale, headerAcceptLanguage)).toBe(
				expected,
			);
		},
	);
});
