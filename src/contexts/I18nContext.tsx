"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Locale, rtlLocales, translations } from "@/lib/i18n";

type TranslationNode = Record<string, unknown>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = "cvbuilder.locale";

function getFromPath(node: TranslationNode, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = node;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in (current as TranslationNode))) {
      return undefined;
    }
    current = (current as TranslationNode)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const dir: "ltr" | "rtl" = rtlLocales.includes(locale) ? "rtl" : "ltr";

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (savedLocale && savedLocale in translations) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, dir]);

  const t = useCallback(
    (key: string) => {
      return getFromPath(translations[locale], key) ?? getFromPath(translations.en, key) ?? key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, dir, t }),
    [locale, setLocale, dir, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  return context;
}
