import Image from "next/image";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
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

				{/* 言語切替 */}
				<LanguageSwitcher />
			</div>
		</header>
	);
}
