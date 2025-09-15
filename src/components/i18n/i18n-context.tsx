"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Messages = Record<string, string>;

type I18nContextValue = {
  locale: string;
  setLocale: (code: string) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "nb_locale";

const DEFAULT_LOCALE = "zh-CN";

const LOCALES = [
  "zh-CN",
  "zh-TW",
  "en",
  "ja",
  "ko",
  "es",
  "fr",
  "de",
  "ru",
] as const;

async function loadMessages(locale: string): Promise<Messages> {
  try {
    switch (locale) {
      case "zh-TW":
        return (await import("@/locales/zh-TW.json")).default;
      case "en":
        return (await import("@/locales/en.json")).default;
      case "ja":
        return (await import("@/locales/ja.json")).default;
      case "ko":
        return (await import("@/locales/ko.json")).default;
      case "es":
        return (await import("@/locales/es.json")).default;
      case "fr":
        return (await import("@/locales/fr.json")).default;
      case "de":
        return (await import("@/locales/de.json")).default;
      case "ru":
        return (await import("@/locales/ru.json")).default;
      case "zh-CN":
      default:
        return (await import("@/locales/zh-CN.json")).default;
    }
  } catch {
    return {};
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setLocaleState(saved || DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    loadMessages(locale).then(setMessages);
  }, [locale]);

  const setLocale = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLocaleState(code);
  };

  const t = (key: string, fallback?: string) => {
    return messages[key] ?? fallback ?? key;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


