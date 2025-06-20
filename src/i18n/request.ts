import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { resolveAcceptLanguage } from "resolve-accept-language";
import type { Locale } from "@/i18n/config";
import {
	DEFAULT_LOCALE,
	isLocale,
	LOCALE_TEXT,
	LOCALE_VALUES,
} from "@/i18n/config";

export async function negotiateLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get(LOCALE_TEXT)?.value;
	if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

	const headerStore = await headers();
	const accept = headerStore.get("accept-language") ?? "";
	const matched = resolveAcceptLanguage(accept, LOCALE_VALUES, DEFAULT_LOCALE);

	return isLocale(matched) ? matched : DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
	const locale = await negotiateLocale();
	return {
		locale,
		messages: (await import(`./messages/${locale}.json`)).default,
	};
});
