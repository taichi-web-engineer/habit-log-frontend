import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	experimental: {
		reactCompiler: true,
	},
};
export default createNextIntlPlugin("./src/features/i18n/request.ts")(
	nextConfig,
);
