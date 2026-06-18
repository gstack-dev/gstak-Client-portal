export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English (US)",
  ar: "العربية",
};

export const isRTL: Record<Locale, boolean> = {
  en: false,
  ar: true,
};

const dictionaries = {
  en: () => import("@/locales/en.json").then((m) => m.default),
  ar: () => import("@/locales/ar.json").then((m) => m.default),
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return isRTL[locale] ? "rtl" : "ltr";
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
