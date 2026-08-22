import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import { Locale } from "@/i18n/config";

const messages = { ar, en } as const;

export type NestedMessages = typeof ar;

export function getMessages(locale: Locale) {
  return messages[locale] || messages.ar;
}

export function getTranslation(locale: Locale, path: string): string {
  const msgs = getMessages(locale);
  const keys = path.split(".");
  let result: unknown = msgs;
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof result === "string" ? result : path;
}
