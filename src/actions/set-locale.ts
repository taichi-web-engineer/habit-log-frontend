"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_TEXT, type LocaleCode } from "@/i18n/config";

export async function setLocale(locale: LocaleCode) {
	(await cookies()).set(LOCALE_TEXT, locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
	});
	redirect("/");
}
