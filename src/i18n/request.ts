import {
	DEFAULT_LOCALE,
	LOCALE_TEXT,
	LOCALE_VALUES,
	isLocale,
} from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

async function negotiateLocale(): Promise<Locale> {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get(LOCALE_TEXT)?.value;
	if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

	const headerStore = await headers();
	const accept = headerStore.get("accept-language");
	if (accept) {
		const langs = accept.split(",").map((l) => l.split(";")[0].trim());
		const matched = matchLocale(langs, LOCALE_VALUES, DEFAULT_LOCALE);
		return isLocale(matched) ? matched : DEFAULT_LOCALE;
	}

	return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
	const locale = await negotiateLocale();
	return {
		locale,
		messages: (await import(`./messages/${locale}.json`)).default,
	};
});
