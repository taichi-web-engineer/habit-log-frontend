"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { setLocale } from "@/actions/set-locale";

const locales = [
	{ code: "ja-JP", name: "日本語" },
	{ code: "en-US", name: "English" },
] as const;

export function LanguageSwitcher() {
	const currentLocale = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleEscapeKey);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isOpen]);

	const handleLocaleChange = async (newLocale: string) => {
		setIsOpen(false);
		await setLocale(newLocale as "ja-JP" | "en-US");
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<Globe className="h-4 w-4" />
				<ChevronDown className="h-4 w-4" />
			</button>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 min-w-max rounded-lg border border-gray-300 bg-white shadow-lg">
					{locales.map((locale) => (
						<button
							key={locale.code}
							type="button"
							onClick={() => handleLocaleChange(locale.code)}
							className={`flex w-full items-center gap-1 px-2 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
								locale.code === currentLocale
									? "bg-blue-50 font-medium text-blue-700"
									: "text-gray-700"
							}`}
						>
							<div className="flex h-4 w-4 items-center justify-center">
								{locale.code === currentLocale && (
									<Check className="h-4 w-4 text-blue-700" />
								)}
							</div>
							<span>{locale.name}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
