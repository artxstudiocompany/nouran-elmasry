"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { Locale, RTL_LOCALES } from "@/i18n/config";
import { getMessages, type NestedMessages } from "@/i18n/messages";
import { useSiteData } from "@/store/DataContext";

interface I18nContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: NestedMessages;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function deepMerge(base: any, override: any): any {
  if (!override || typeof override !== "object") return base;
  if (!base || typeof base !== "object") return override;
  const result: any = { ...base };
  for (const key of Object.keys(override)) {
    if (key in result && typeof result[key] === "object" && typeof override[key] === "object" && !Array.isArray(override[key])) {
      result[key] = deepMerge(result[key], override[key]);
    } else if (override[key] !== undefined) {
      result[key] = override[key];
    }
  }
  return result;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const { translations } = useSiteData();
  const staticMessages = getMessages(locale);
  const t = deepMerge(staticMessages, translations[locale]) as NestedMessages;

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && (stored === "ar" || stored === "en")) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
