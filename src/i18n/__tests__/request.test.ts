import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";
import { determineLocale } from "@/i18n/request";

type TestCase = readonly [
	string, // テストタイトル
	string | undefined, // cookieLocale
	string | null, // headerAcceptLanguage
	string, // expecteed
];

const testCases = [
	// 正常系
	[
		`cookie:${LOCALES.EN}、accept-language:ja,en;q=0.9`,
		LOCALES.EN,
		"ja,en;q=0.9",
		LOCALES.JA,
	],
	[
		`cookie:${LOCALES.JA}、accept-language:en,ja;q=0.9`,
		LOCALES.JA,
		"en,ja;q=0.9",
		LOCALES.JA,
	],
	["cookie:無効、accept-language:無効", undefined, null, DEFAULT_LOCALE],
	[
		"cookie:無効、accept-language:en,ja;q=0.9",
		undefined,
		"en,ja;q=0.9",
		LOCALES.EN,
	],
	[
		"cookie:無効、accept-language:ja,en;q=0.9",
		undefined,
		"ja,en;q=0.9",
		LOCALES.JA,
	],
	// エッジケース
	["想定外のcookie", "123", "ja,en;q=0.9", DEFAULT_LOCALE],
	["想定外のaccept-language", undefined, "###", DEFAULT_LOCALE],
	["地域サブタグ付きaccept-language", undefined, "en-US,ja;q=0.5", LOCALES.EN],
] satisfies readonly TestCase[];

describe("determineLocale", () => {
	test.each(testCases)("%s", (_, cookieLocale, acceptHeader, expected) => {
		expect(determineLocale(cookieLocale, acceptHeader)).toBe(expected);
	});
});
