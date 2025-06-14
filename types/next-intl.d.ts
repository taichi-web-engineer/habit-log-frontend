import "next-intl";
import type jp from "@/i18n/messages/jp.json";

declare module "next-intl" {
	interface AppConfig {
		Messages: typeof jp;
	}
}
