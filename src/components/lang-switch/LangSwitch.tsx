import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { trackAnalyticsEvent } from "../../services/analytics.service";
import "./LangSwitch.scss";

const languages = [
  { label: "FR", value: "fr" },
  { label: "EN", value: "en" },
] as const;

export default function LangSwitch() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.startsWith("en") ? "en" : "fr";

  function changeLanguage(language: "fr" | "en") {
    if (language === currentLanguage) return;
    trackAnalyticsEvent("language_changed", { language });
    void i18n.changeLanguage(language);
  }

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <div className="lang-container" role="group" aria-label={t("portfolio.languageLabel")}>
      {languages.map((language) => (
        <button
          key={language.value}
          type="button"
          aria-pressed={currentLanguage === language.value}
          onClick={() => changeLanguage(language.value)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
