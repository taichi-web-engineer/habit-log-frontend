import { cookies, headers } from "next/headers";
import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { resolveAcceptLanguage } from "resolve-accept-language";
import {
	DEFAULT_LOCALE,
	isLocale,
	LOCALE_TEXT,
	LOCALE_VALUES,
} from "@/i18n/config";

export function determineLocale(
	cookieLocale: string | undefined,
	acceptHeader: string | null,
	resolveLanguage = resolveAcceptLanguage,
) {
	if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

	if (!acceptHeader) return DEFAULT_LOCALE;

	const matched = resolveLanguage(acceptHeader, LOCALE_VALUES, DEFAULT_LOCALE);
	return isLocale(matched) ? matched : DEFAULT_LOCALE;
}

async function negotiateLocale() {
	const cookieStore = await cookies();
	const headerStore = await headers();

	return determineLocale(
		cookieStore.get(LOCALE_TEXT)?.value,
		headerStore.get("accept-language"),
	);
}

export default getRequestConfig(async () => {
	const locale = await negotiateLocale();
	let messages: AbstractIntlMessages = {};
	try {
		// ↓ビルド時解析のためにinclude ヒントを付与
		messages = (
			await import(
				/* webpackInclude: /messages\/.*\.json$/ */
				`./messages/${locale}.json`
			)
		).default;
	} catch (err) {
		console.error(
			`locale "${locale}" のメッセージファイルが見つかりません`,
			err,
		);
	}
	return { locale, messages };
});
