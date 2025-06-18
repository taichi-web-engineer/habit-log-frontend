import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
	const translations = useTranslations("Home");
	return (
		<>
			<h1>{translations("topPage")}</h1>
			<LanguageSwitcher />
		</>
	);
}
