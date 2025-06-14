export const LOCALES = {
	EN: "en",
	JP: "jp",
} as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

export const LOCALE_TEXT = "locale";

export const DEFAULT_LOCALE = LOCALES.JP;

export const LOCALE_VALUES = Object.values(LOCALES) as readonly Locale[];

export const isLocale = (locale: string): locale is Locale =>
	(LOCALE_VALUES as readonly string[]).includes(locale);
