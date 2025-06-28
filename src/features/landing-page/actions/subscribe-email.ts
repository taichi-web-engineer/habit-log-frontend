"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";

const subscribeSchema = z.object({
	email: z.string().email({
		message: "メールアドレスの形式が正しくありません",
	}),
	website: z.string().optional(),
});

export async function subscribeEmail(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: subscribeSchema,
	});

	if (submission.status !== "success") {
		return submission.reply();
	}

	// Check honeypot field - if filled, it's likely a bot
	if (submission.value.website) {
		// Silently reject bot submissions
		redirect("/?subscribed=true");
		return;
	}

	// TODO: Implement actual email subscription logic here
	// For now, just log the email and redirect
	console.log("Email subscribed:", submission.value.email);

	// Redirect to a success page or show a success message
	redirect("/?subscribed=true");
}
