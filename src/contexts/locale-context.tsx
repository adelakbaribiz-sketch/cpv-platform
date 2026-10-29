"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { STORAGE_KEYS, STRINGS } from "@/lib/constants";
import { safeLocalGet, safeLocalSet } from "@/lib/utils";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "ltr" | "rtl";
  t: (key: keyof typeof STRINGS["en"]) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = safeLocalGet(STORAGE_KEYS.locale) as Locale | null;
    if (saved === "en" || saved === "fa") setLocaleState(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    safeLocalSet(STORAGE_KEYS.locale, locale);
    const dir = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);
  }, [locale, mounted]);

  const setLocale = (l: Locale) => setLocaleState(l);
  const dir = locale === "fa" ? "rtl" : "ltr";
  const t = (key: keyof typeof STRINGS["en"]) => STRINGS[locale][key] ?? STRINGS.en[key] ?? String(key);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
