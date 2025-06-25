import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	HeartHandshake,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";

export default function Home() {
	const t = useTranslations("Home");
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Header />
			<div className="container mx-auto px-4 py-8 lg:py-16">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* 左側セクション */}
					<div className="space-y-8">
						{/* メインコピー */}
						<div className="space-y-4">
							<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
								{t("title")}
							</h1>
							<p className="text-lg text-gray-600 leading-relaxed">
								{t("description")}
							</p>
						</div>

						{/* 特徴 */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 text-green-500" />
								<span className="text-sm font-medium text-gray-700">
									{t("features.tracking")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<BarChart3 className="w-5 h-5 text-blue-500" />
								<span className="text-sm font-medium text-gray-700">
									{t("features.visualization")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<HeartHandshake className="w-5 h-5 text-purple-500" />
								<span className="text-sm font-medium text-gray-700">
									{t("features.support")}
								</span>
							</div>
						</div>

						{/* メール入力とCTAボタン */}
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									placeholder={t("emailPlaceholder")}
									className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
								<button
									type="button"
									className="bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-500 hover:to-blue-800 text-white font-medium px-8 py-3 rounded-lg shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 whitespace-nowrap"
								>
									{t("cta")}
									<ArrowRight className="w-5 h-5" />
								</button>
							</div>
						</div>

						{/* ユーザー数 */}
						<div className="space-y-3">
							<p className="text-sm text-gray-600">{t("userCount")}</p>
							<div className="flex items-center gap-2">
								<div className="flex -space-x-3">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											key={i}
											className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold"
										>
											{i}
										</div>
									))}
								</div>
								<span className="text-sm font-medium text-gray-700 ml-2">
									+10,000
								</span>
							</div>
						</div>
					</div>

					{/* 右側セクション - モバイルモックアップ */}
					<div className="relative">
						<div className="relative mx-auto max-w-[320px]">
							{/* モバイルフレーム */}
							<div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
								<div className="bg-white rounded-[2.5rem] overflow-hidden">
									{/* ステータスバー */}
									<div className="bg-gray-900 px-6 py-2 flex justify-between items-center text-white text-xs">
										<span>9:41</span>
										<div className="flex gap-1">
											<div className="w-4 h-3 bg-white rounded-sm" />
											<div className="w-4 h-3 bg-white rounded-sm" />
											<div className="w-4 h-3 bg-white rounded-sm" />
										</div>
									</div>

									{/* アプリコンテンツ */}
									<div className="p-6 space-y-6">
										{/* ヘッダー */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Image
													src="/icon.svg"
													alt="Habit Log"
													width={32}
													height={32}
													className="w-8 h-8 rounded-lg"
												/>
												<span className="font-bold text-gray-900">
													Habit Log
												</span>
											</div>
											<div className="text-sm text-gray-500">
												ダッシュボード
											</div>
										</div>

										{/* 習慣カード */}
										<div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-4 text-white">
											<div className="flex items-center justify-between mb-2">
												<span className="font-medium">腕立て伏せ</span>
												<div className="flex items-center gap-1">
													<div className="w-2 h-2 bg-white rounded-full" />
													<span className="text-xs">今日実施予定</span>
												</div>
											</div>
											<div className="text-sm opacity-90">直近の記録</div>
										</div>

										{/* チャート */}
										<div className="bg-gray-50 rounded-2xl p-4">
											<div className="flex justify-center items-end gap-2 h-32">
												{[40, 60, 45, 80, 65, 90, 75].map((height) => (
													<div
														key={`chart-bar-${height}`}
														className="w-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg"
														style={{ height: `${height}%` }}
													/>
												))}
											</div>
										</div>

										{/* 統計 */}
										<div className="grid grid-cols-3 gap-3">
											<div className="text-center">
												<div className="text-2xl font-bold text-blue-600">
													156
												</div>
												<div className="text-xs text-gray-500">総日数</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-green-600">
													2,847
												</div>
												<div className="text-xs text-gray-500">総回数</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-purple-600">
													12
												</div>
												<div className="text-xs text-gray-500">復活回数</div>
											</div>
										</div>

										{/* フローティングボタン */}
										<div className="flex justify-end">
											<div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg">
												<span className="text-2xl">+</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* ドットインジケーター */}
						<div className="flex justify-center gap-2 mt-8">
							<div className="w-2 h-2 bg-blue-500 rounded-full" />
							<div className="w-2 h-2 bg-gray-300 rounded-full" />
							<div className="w-2 h-2 bg-gray-300 rounded-full" />
							<div className="w-2 h-2 bg-gray-300 rounded-full" />
						</div>

						{/* ターゲットアイコン */}
						<div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
							<CheckCircle className="w-10 h-10 text-white" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
