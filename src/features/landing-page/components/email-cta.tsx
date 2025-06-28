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

const createSubscribeSchema = (
	emailRequiredMessage: string,
	emailInvalidMessage: string,
) =>
	z.object({
		email: z.string({ required_error: emailRequiredMessage }).trim().email({
			message: emailInvalidMessage,
		}),
		// Honeypotフィールド
		website: z.string().optional(),
	});

export function EmailCTA() {
	const emailId = useId();
	const translations = useTranslations("Home");
	const [lastResult, action, isPending] = useActionState(
		subscribeEmail,
		undefined,
	);

	const subscribeSchema = createSubscribeSchema(
		translations("emailRequired"),
		translations("emailInvalid"),
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
						defaultValue={fields.email.initialValue}
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
						translations("submitting")
					) : (
						<>
							{translations("cta")}
							<ArrowRight />
						</>
					)}
				</Button>
			</div>
			<input
				type="text"
				name="website"
				className="absolute left-[-9999px] h-[1px] w-[1px] overflow-hidden"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
			/>
		</form>
	);
}
