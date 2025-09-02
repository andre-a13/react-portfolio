import { useTranslation } from "react-i18next";

export default function ExpCard2() {
  const { t } = useTranslation();

  return (
<section className="experience-card">
  <h3>{t("experiences.pwc.title")}</h3>
  <p>{t("experiences.pwc.description1")}</p>
  <p>{t("experiences.pwc.description2")}</p>
  <p>{t("experiences.pwc.description3")}</p>
  <p>{t("experiences.pwc.description4")}</p>
</section>
  );
}
