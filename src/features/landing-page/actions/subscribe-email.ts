"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { z } from "zod";

const subscribeSchema = z.object({
	email: z.string().email({
		message: "メールアドレスの形式が正しくありません",
	}),
});

export async function subscribeEmail(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: subscribeSchema,
	});

	if (submission.status !== "success") {
		return submission.reply();
	}

	// TODO: Implement actual email subscription logic here
	// For now, just log the email and redirect
	console.log("Email subscribed:", submission.value.email);

	// Redirect to a success page or show a success message
	redirect("/?subscribed=true");
}
