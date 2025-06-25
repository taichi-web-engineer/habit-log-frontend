import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
	const translations = useTranslations("Home");

	return (
		<header className="w-full px-4 py-4">
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Image
						src="/icon.svg"
						alt="Habit Log"
						width={40}
						height={40}
						className="rounded-xl shadow-lg"
					/>
					<span className="font-bold text-2xl text-gray-900">Habit Log</span>
				</div>
				<nav
					className="flex items-center gap-4"
					aria-label={translations("headerNav")}
				>
					<LanguageSwitcher />
					<Link
						href="/login"
						className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-blue-700 px-3 py-2 text-sm text-white shadow-xl transition-all hover:scale-105 hover:from-blue-500 hover:to-blue-800"
					>
						{translations("login")}
					</Link>
				</nav>
			</div>
		</header>
	);
}
