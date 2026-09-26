import "@fontsource-variable/manrope";
import { ArrowLeft, BarChart3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import LangSwitch from "../../lang-switch/LangSwitch";
import {
  getAnalyticsPreference,
  setAnalyticsPreference,
  type AnalyticsPreference,
} from "../../../services/analytics.service";
import "./privacy.scss";

export default function Privacy() {
  const { t } = useTranslation();
  const [preference, setPreference] = useState<AnalyticsPreference>(() =>
    getAnalyticsPreference(),
  );

  function updatePreference(nextPreference: AnalyticsPreference) {
    setAnalyticsPreference(nextPreference);
    setPreference(nextPreference);
  }

  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          {t("privacy.back")}
        </Link>
        <LangSwitch />
      </header>

      <main className="privacy-main">
        <p className="privacy-eyebrow"><ShieldCheck size={18} aria-hidden="true" />{t("privacy.eyebrow")}</p>
        <h1>{t("privacy.title")}</h1>
        <p className="privacy-lead">{t("privacy.lead")}</p>

        <div className="privacy-grid">
          <section>
            <h2>{t("privacy.purpose.title")}</h2>
            <p>{t("privacy.purpose.text")}</p>
          </section>
          <section>
            <h2>{t("privacy.data.title")}</h2>
            <p>{t("privacy.data.text")}</p>
          </section>
          <section>
            <h2>{t("privacy.retention.title")}</h2>
            <p>{t("privacy.retention.text")}</p>
          </section>
          <section>
            <h2>{t("privacy.rights.title")}</h2>
            <p>{t("privacy.rights.text")}</p>
          </section>
        </div>

        <section className="privacy-choice" aria-labelledby="privacy-choice-title">
          <BarChart3 size={24} aria-hidden="true" />
          <div>
            <h2 id="privacy-choice-title">{t("privacy.choice.title")}</h2>
            <p>{t(`privacy.choice.${preference}`)}</p>
          </div>
          <button
            type="button"
            onClick={() => updatePreference(preference === "enabled" ? "disabled" : "enabled")}
          >
            {t(`privacy.choice.action.${preference}`)}
          </button>
        </section>

        <p className="privacy-contact">
          {t("privacy.contact")} <a href="mailto:arnaud.a.dev@gmail.com">arnaud.a.dev@gmail.com</a>
        </p>
      </main>
    </div>
  );
}
