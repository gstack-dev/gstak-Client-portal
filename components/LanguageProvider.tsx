"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { defaultLocale, localeNames, isValidLocale, getDir, type Locale, type Dictionary } from "@/lib/i18n";

const COOKIE_NAME = "NEXT_LOCALE";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  localeNames: Record<Locale, string>;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key: string) => key,
  dir: "ltr",
  localeNames,
});

function resolve(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
}

export function LanguageProvider({ children, dictionary: initialDict }: { children: ReactNode; dictionary?: Dictionary }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dict, setDict] = useState<Dictionary | null>(initialDict ?? null);

  useEffect(() => {
    const cookieVal = getCookie(COOKIE_NAME);
    if (cookieVal && isValidLocale(cookieVal)) {
      setLocaleState(cookieVal);
      if (!initialDict) {
        import(`@/locales/${cookieVal}.json`).then((m) => setDict(m.default));
      }
    } else {
      if (!initialDict) {
        import(`@/locales/${defaultLocale}.json`).then((m) => setDict(m.default));
      }
    }
  }, [initialDict]);

  const setLocale = useCallback((newLocale: Locale) => {
    setCookie(COOKIE_NAME, newLocale);
    setLocaleState(newLocale);
    import(`@/locales/${newLocale}.json`).then((m) => setDict(m.default));
    window.location.reload();
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      if (!dict) return key;
      let value = resolve(dict as Record<string, unknown>, key);
      if (typeof value !== "string") {
        const enDict = resolve({} as Record<string, unknown>, key);
        if (typeof enDict === "string") value = enDict;
        else return key;
      }
      if (params) {
        return Object.entries(params).reduce((str, [k, v]) => str.replace(`{${k}}`, String(v)), value as string);
      }
      return value as string;
    },
    [dict]
  );

  const dir = getDir(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, localeNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
