import { useTranslations } from "next-intl";

export default function Home() {
	const translations = useTranslations("Home");
	return (
		<>
			<h1>{translations("topPage")}</h1>
		</>
	);
}
