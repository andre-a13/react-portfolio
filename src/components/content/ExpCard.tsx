import { useTranslation } from "react-i18next";

export default function ExpCard() {
  const { t } = useTranslation();

  return (
    <section className="experience-card">
      <h3>{t("experiences.webexpr.title")}</h3>
      <p>{t("experiences.webexpr.description1")}</p>
      <p>{t("experiences.webexpr.description2")}</p>
      <p>{t("experiences.webexpr.description3")}</p>
      <p>{t("experiences.webexpr.description4")}</p>
    </section>
  );
}
