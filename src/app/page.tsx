import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	HeartHandshake,
	Plus,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { APP_NAME } from "@/config/site";
import { Header } from "@/features/landing-page/components/header";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";

export default function Home() {
	const emailId = useId();
	const translations = useTranslations("Home");

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Header />
			<div className="container mx-auto px-4 py-8 lg:py-16">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="space-y-8">
						<div className="space-y-4">
							<h1 className="font-bold text-5xl text-gray-900 leading-tight lg:text-6xl">
								{translations("title")}
							</h1>
							<p className="text-gray-600 text-lg leading-relaxed">
								{translations("description", { appName: APP_NAME })}
							</p>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div className="flex items-center gap-2">
								<CheckCircle className="h-5 w-5 text-green-500" />
								<span className="font-medium text-gray-700 text-sm">
									{translations("features.tracking")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5 text-blue-500" />
								<span className="font-medium text-gray-700 text-sm">
									{translations("features.visualization")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<HeartHandshake className="h-5 w-5 text-purple-500" />
								<span className="font-medium text-gray-700 text-sm">
									{translations("features.support")}
								</span>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex flex-col gap-3 sm:flex-row">
								<Input
									id={emailId}
									type="email"
									placeholder={translations("emailPlaceholder")}
									className="h-auto flex-1 py-3"
								/>
								<Button variant="gradient" size="xl">
									{translations("cta")}
									<ArrowRight />
								</Button>
							</div>
						</div>
						<div className="space-y-3">
							<p className="text-gray-600 text-sm">
								{translations("userCount")}
							</p>
							<div className="flex items-center gap-2">
								<div className="-space-x-3 flex">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											key={i}
											className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-cyan-400 to-teal-500 font-semibold text-white"
										>
											{i}
										</div>
									))}
								</div>
								<span className="ml-2 font-medium text-gray-700 text-sm">
									+10,000
								</span>
							</div>
						</div>
					</div>
					<div className="relative">
						<div className="relative mx-auto max-w-[320px]">
							<Card className="rounded-[3rem] border-none bg-gray-900 p-3 shadow-2xl">
								<div className="overflow-hidden rounded-[2.5rem] bg-white">
									<div className="flex items-center justify-between bg-gray-900 px-6 py-2 text-white text-xs">
										<span>9:41</span>
										<div className="flex gap-1">
											<div className="h-3 w-4 rounded-sm bg-white" />
											<div className="h-3 w-4 rounded-sm bg-white" />
											<div className="h-3 w-4 rounded-sm bg-white" />
										</div>
									</div>
									<CardContent className="space-y-6 p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Image
													src="/icon.svg"
													alt="Habit Log"
													width={32}
													height={32}
													className="h-8 w-8 rounded-lg"
												/>
												<span className="font-bold text-gray-900">
													Habit Log
												</span>
											</div>
											<Badge
												variant="outline"
												className="border-gray-300 font-normal text-gray-500"
											>
												ダッシュボード
											</Badge>
										</div>
										<Card className="border-none bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
											<CardContent className="p-4">
												<div className="mb-2 flex items-center justify-between">
													<span className="font-medium">腕立て伏せ</span>
													<div className="flex items-center gap-1">
														<div className="h-2 w-2 rounded-full bg-white" />
														<span className="text-xs">今日実施予定</span>
													</div>
												</div>
												<div className="text-sm opacity-90">直近の記録</div>
											</CardContent>
										</Card>
										<Card className="border-none bg-gray-50">
											<CardContent className="p-4">
												<div className="flex h-32 items-end justify-center gap-2">
													{[40, 60, 45, 80, 65, 90, 75].map((height) => (
														<div
															key={`chart-bar-${height}`}
															className="w-8 rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400"
															style={{ height: `${height}%` }}
														/>
													))}
												</div>
											</CardContent>
										</Card>
										<div className="grid grid-cols-3 gap-3">
											<Card className="border-none bg-transparent">
												<CardContent className="p-0 text-center">
													<div className="font-bold text-2xl text-blue-600">
														156
													</div>
													<div className="text-gray-500 text-xs">総日数</div>
												</CardContent>
											</Card>
											<Card className="border-none bg-transparent">
												<CardContent className="p-0 text-center">
													<div className="font-bold text-2xl text-green-600">
														2,847
													</div>
													<div className="text-gray-500 text-xs">総回数</div>
												</CardContent>
											</Card>
											<Card className="border-none bg-transparent">
												<CardContent className="p-0 text-center">
													<div className="font-bold text-2xl text-purple-600">
														12
													</div>
													<div className="text-gray-500 text-xs">復活回数</div>
												</CardContent>
											</Card>
										</div>
										<div className="flex justify-end">
											<Button
												size="icon"
												className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white shadow-lg hover:from-cyan-500 hover:to-teal-600"
											>
												<Plus className="h-6 w-6" />
											</Button>
										</div>
									</CardContent>
								</div>
							</Card>
						</div>
						<div className="mt-8 flex justify-center gap-2">
							<div className="h-2 w-2 rounded-full bg-blue-500" />
							<div className="h-2 w-2 rounded-full bg-gray-300" />
							<div className="h-2 w-2 rounded-full bg-gray-300" />
							<div className="h-2 w-2 rounded-full bg-gray-300" />
						</div>
						<Card className="-bottom-4 -right-4 absolute flex h-20 w-20 items-center justify-center rounded-full border-none bg-green-500 shadow-xl">
							<CheckCircle className="h-10 w-10 text-white" />
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
