/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default async (): Promise<Config> => {
	// ⚠️ ここでは「最小限」のオプションだけ渡す
	const baseConfig = await createJestConfig({
		testEnvironment: "jsdom",
		setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
		moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
	})();

	// 型定義に載っていない項目をここで合流させる
	return {
		...baseConfig,

		collectCoverage: true,
		coverageDirectory: "<rootDir>/coverage",
		coverageProvider: "v8",
		collectCoverageFrom: [
			"<rootDir>/**/*.{ts,tsx}",
			"!<rootDir>/**/*.d.ts",
			"!<rootDir>/**/__tests__/**",
		],
		transformIgnorePatterns: ["node_modules/(?!next-intl)/"],
	};
};
