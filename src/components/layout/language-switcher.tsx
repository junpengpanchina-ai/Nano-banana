"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-context";

type Locale = {
  code: string; // e.g., zh-CN
  label: string; // e.g., 简体中文
};

const DEFAULT_LOCALES: Locale[] = [
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
];

const STORAGE_KEY = "nb_locale";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const locales = useMemo<Locale[]>(() => DEFAULT_LOCALES, []);
  const [current, setCurrent] = useState<Locale>(locales.find(l => l.code === locale) || locales[0]);

  useEffect(() => {
    const found = locales.find((l) => l.code === locale);
    if (found) setCurrent(found);
  }, [locales, locale]);

  const handleSelect = (locale: Locale) => {
    setCurrent(locale);
    setLocale(locale.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <Globe className="w-4 h-4" />
          <span>{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>选择语言</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => handleSelect(l)}>
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-muted-foreground/40" />
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


