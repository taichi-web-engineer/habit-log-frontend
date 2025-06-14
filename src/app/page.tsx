import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function HomePage() {
	const translations = useTranslations("Home");
	return (
		<>
			<h1>{translations("topPage")}</h1>
			<LanguageSwitcher />
		</>
	);
}
