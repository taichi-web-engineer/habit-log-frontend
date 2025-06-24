import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
	const t = useTranslations("Home");

	return (
		<div className="relative min-h-screen bg-black">
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
				style={{
					backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.9) 100%), url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%23111'/%3E%3Cpath d='M0 50h100' stroke='%23333' stroke-width='0.5'/%3E%3Cpath d='M50 0v100' stroke='%23333' stroke-width='0.5'/%3E%3C/svg%3E")`,
				}}
			/>

			<div className="relative z-10">
				<header className="flex items-center justify-between px-4 py-6 md:px-12">
					<h1 className="text-3xl font-bold text-red-600 md:text-4xl">
						Habit Log
					</h1>
					<div className="flex items-center gap-4">
						<LocaleSwitcher />
						<Button
							variant="default"
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{t("login")}
						</Button>
					</div>
				</header>

				<main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
							{t("mainCatchCopy")}
						</h2>
						<p className="mb-8 text-lg text-gray-300 md:text-xl">
							{t("subCopy")}
						</p>

						<div className="mx-auto max-w-xl">
							<div className="flex flex-col gap-4 sm:flex-row">
								<Input
									type="email"
									placeholder={t("emailPlaceholder")}
									className="h-14 bg-black/50 border-gray-600 text-white placeholder:text-gray-400 text-base"
								/>
								<Button
									size="lg"
									className="h-14 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold px-8 whitespace-nowrap"
								>
									{t("getStarted")}
								</Button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
