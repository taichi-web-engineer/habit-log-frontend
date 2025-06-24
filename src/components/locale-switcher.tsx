"use client";

import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "@/actions/set-locale";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LOCALES, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
	const locale = useLocale() as Locale;
	const t = useTranslations("Languages");

	const handleChange = async (value: string) => {
		await setLocale(value as Locale);
		window.location.reload();
	};

	return (
		<Select value={locale} onValueChange={handleChange}>
			<SelectTrigger className="w-[140px] bg-black/50 border-gray-600 text-white">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={LOCALES.JA}>{t("ja")}</SelectItem>
				<SelectItem value={LOCALES.EN}>{t("en")}</SelectItem>
			</SelectContent>
		</Select>
	);
}
