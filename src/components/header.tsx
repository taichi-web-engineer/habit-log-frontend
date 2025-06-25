import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
	const t = useTranslations("Home");

	return (
		<header className="w-full py-4 px-4">
			<div className="container mx-auto flex items-center justify-between">
				{/* ロゴ */}
				<div className="flex items-center gap-3">
					<Image
						src="/icon.svg"
						alt="Habit Log"
						width={40}
						height={40}
						className="w-10 h-10 rounded-xl shadow-lg"
					/>
					<span className="text-2xl font-bold text-gray-900">Habit Log</span>
				</div>

				{/* 右側のボタン群 */}
				<div className="flex items-center gap-4">
					{/* 言語切替 */}
					<LanguageSwitcher />

					{/* ログインボタン */}
					<button
						type="button"
						className="bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl flex items-center justify-center transition-all transform hover:scale-105"
					>
						{t("login")}
					</button>
				</div>
			</div>
		</header>
	);
}
