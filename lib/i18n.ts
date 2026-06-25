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

export function createT(dict: Dictionary) {
  return (key: string, params?: Record<string, string | number>) => {
    const val = key.split(".").reduce((acc: unknown, part) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
      return undefined;
    }, dict as unknown as Record<string, unknown>);
    if (typeof val !== "string") return key;
    if (!params) return val;
    return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), val);
  };
}
