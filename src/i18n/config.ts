export const LOCALES = {
	EN: "en-US",
	JA: "ja-JP",
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const LOCALE_TEXT = "locale";

export const DEFAULT_LOCALE = LOCALES.JA;

export const LOCALE_VALUES = Object.values(LOCALES) as readonly Locale[];

export const isLocale = (locale: string | null | undefined): locale is Locale =>
	typeof locale === "string" &&
	(LOCALE_VALUES as readonly string[]).includes(locale);
