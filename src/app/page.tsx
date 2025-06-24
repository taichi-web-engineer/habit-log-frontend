import { useTranslations } from "next-intl";

export default function Home() {
	const translation = useTranslations("Home");

	return (
		<>
			<p>{translation("topPage")}</p>
		</>
	);
}
