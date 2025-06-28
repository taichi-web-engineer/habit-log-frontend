"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";

export function EmailCTA() {
	const emailId = useId();
	const translations = useTranslations("Home");

	return (
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
	);
}
