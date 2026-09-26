import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  consumeAnalyticsPreferenceNotice,
  type AnalyticsPreference,
} from "../../services/analytics.service";
import "./analytics-preference-notice.scss";

export default function AnalyticsPreferenceNotice() {
  const { t } = useTranslation();
  const [notice, setNotice] = useState<AnalyticsPreference | null>(() =>
    consumeAnalyticsPreferenceNotice(),
  );

  useEffect(() => {
    function handlePreferenceChange(event: Event) {
      setNotice((event as CustomEvent<AnalyticsPreference>).detail);
    }

    window.addEventListener("analytics-preference-changed", handlePreferenceChange);
    return () => window.removeEventListener("analytics-preference-changed", handlePreferenceChange);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!notice) return null;
  return (
    <div className="analytics-preference-notice" role="status">
      {t(`privacy.notice.${notice}`)}
    </div>
  );
}
