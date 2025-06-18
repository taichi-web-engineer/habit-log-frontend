"use server";

import { cookies } from "next/headers";
import { LOCALE_TEXT, type Locale } from "@/i18n/config";

export async function setLocale(locale: Locale) {
	(await cookies()).set(LOCALE_TEXT, locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
	});
}
