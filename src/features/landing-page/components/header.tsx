import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { APP_NAME } from "@/config/site";
import "@/styles/components.css";
import { LanguageSwitcher } from "@/features/landing-page/components/language-switcher";

export function Header() {
	const translations = useTranslations("Home");

	return (
		<header className="w-full p-4">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<Link href="/" className="flex items-center gap-3">
					<Image
						src="/icon.svg"
						alt={APP_NAME}
						width={40}
						height={40}
						className="rounded-xl shadow-lg"
					/>
					<span className="font-bold text-2xl text-gray-900">{APP_NAME}</span>
				</Link>
				<nav
					className="flex items-center gap-4"
					aria-label={translations("headerNav")}
				>
					<LanguageSwitcher />
					<Link
						href="/login"
						className="btn-blue-gradation px-3 py-2 font-medium text-sm"
					>
						{translations("login")}
					</Link>
				</nav>
			</div>
		</header>
	);
}
