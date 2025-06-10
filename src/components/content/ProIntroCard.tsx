import { useTranslation } from "react-i18next";

export default function ProIntroCard() {
  const { t } = useTranslation();

  return (
    <>
      <p>{t("proIntro.1")}</p>
      <p>{t("proIntro.2")}</p>
      <p>{t("proIntro.3")}</p>
      <p>{t("proIntro.4")}</p>
    </>
  );
}
