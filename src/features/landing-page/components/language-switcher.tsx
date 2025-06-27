"use client";

import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { LOCALE_KEYS, LOCALES, type LocaleCode } from "@/features/i18n/config";
import { setLocale } from "@/features/i18n/set-locale";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

export function LanguageSwitcher() {
	const currentLocale = useLocale();
	const [isPending, startTransition] = useTransition();

	const handleLocaleChange = (newLocaleCode: LocaleCode) => {
		startTransition(() => {
			setLocale(newLocaleCode);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					disabled={isPending}
					className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Globe className="h-4 w-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{LOCALE_KEYS.map((key) => {
					const { code, name } = LOCALES[key];
					const isActive = code === currentLocale;

					return (
						<DropdownMenuItem
							key={key}
							onClick={() => {
								handleLocaleChange(code);
							}}
							className={isActive ? "font-medium text-blue-700" : ""}
							disabled={isPending}
						>
							<div className="flex h-4 w-4 items-center justify-center">
								{isActive && <Check className="h-4 w-4" />}
							</div>
							<span>{name}</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
