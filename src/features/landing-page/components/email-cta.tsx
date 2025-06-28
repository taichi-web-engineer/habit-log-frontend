"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useId } from "react";
import { z } from "zod";
import { subscribeEmail } from "@/features/landing-page/actions/subscribe-email";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

const subscribeSchema = z.object({
	email: z.string().email({
		message: "メールアドレスの形式が正しくありません",
	}),
});

export function EmailCTA() {
	const emailId = useId();
	const translations = useTranslations("Home");
	const [lastResult, action, isPending] = useActionState(
		subscribeEmail,
		undefined,
	);

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: subscribeSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			className="space-y-3"
		>
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Label htmlFor={emailId} className="sr-only">
						{translations("emailPlaceholder")}
					</Label>
					<Input
						id={emailId}
						name={fields.email.name}
						type="email"
						placeholder={translations("emailPlaceholder")}
						className="h-auto py-3"
						aria-invalid={!fields.email.valid || undefined}
						aria-describedby={
							!fields.email.valid ? fields.email.errorId : undefined
						}
					/>
					{fields.email.errors && (
						<p
							id={fields.email.errorId}
							className="absolute mt-1 text-destructive text-sm"
						>
							{fields.email.errors}
						</p>
					)}
				</div>
				<Button type="submit" variant="gradient" size="xl" disabled={isPending}>
					{isPending ? (
						"送信中..."
					) : (
						<>
							{translations("cta")}
							<ArrowRight />
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
