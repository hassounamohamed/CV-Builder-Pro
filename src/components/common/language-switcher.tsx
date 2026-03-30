"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Locale, localeLabels } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="h-8 rounded-md border border-border bg-background px-2 text-foreground"
      >
        {Object.entries(localeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
