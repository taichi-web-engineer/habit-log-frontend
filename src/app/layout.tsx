import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { getLocale, getMessages } from "next-intl/server";
import { APP_NAME, DESCRIPTION, SITE_URL } from "@/config/site";

export const metadata: Metadata = {
	title: {
		default: APP_NAME,
		template: `%s | ${APP_NAME}`,
	},
	description: DESCRIPTION,
	alternates: {
		canonical: SITE_URL,
		languages: {
			ja: SITE_URL,
		},
	},
	icons: {
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#fff",
			},
		],
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<ClerkProvider>
			<html lang={locale}>
				<body className="antialiased">
					<NextIntlClientProvider locale={locale} messages={messages}>
						{children}
					</NextIntlClientProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
