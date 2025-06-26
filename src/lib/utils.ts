import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const includes = <const T extends readonly string[]>(
	array: T,
	value: unknown,
): value is T[number] => (array as readonly unknown[]).includes(value);
