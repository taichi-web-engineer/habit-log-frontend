import { includes } from "@/lib/utils";

export const LOCALES = {
	JA: { code: "ja-JP", name: "日本語" },
	EN: { code: "en-US", name: "English" },
} as const;

export const LOCALE_KEYS = Object.keys(LOCALES) as (keyof typeof LOCALES)[];

export const DEFAULT_LOCALE_CODE = LOCALES.JA.code;

export type LocaleCode = (typeof LOCALES)[keyof typeof LOCALES]["code"];

export const LOCALE_CODES = Object.values(LOCALES).map(
	(locale) => locale.code,
) satisfies readonly LocaleCode[];

export const LOCALE_TEXT = "locale";

export const isLocaleCode = (value: unknown): value is LocaleCode =>
	includes(LOCALE_CODES, value);
