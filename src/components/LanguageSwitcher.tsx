"use client";
import { useRouter } from "next/navigation";
import { setLocale } from "@/actions/set-locale";
import { LOCALES, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
	const router = useRouter();

	const change = async (locale: Locale) => {
		await setLocale(locale);
		router.refresh();
	};

	return (
		<div className="space-x-2">
			<button type="button" onClick={() => change(LOCALES.JP)}>
				日本語
			</button>
			<button type="button" onClick={() => change(LOCALES.EN)}>
				English
			</button>
		</div>
	);
}
