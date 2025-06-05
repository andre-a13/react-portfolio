import { useTranslation } from "react-i18next";
import "./LangSwitch.scss";

const langs = [
  {
    lang: "FR",
    value: "fr",
  },
  {
    lang: "EN",
    value: "en",
  },
];

export default function LangSwitch() {
  const { i18n } = useTranslation();

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="lang-container">
      <span className="lang-active">
        {langs.find((l) => l.value === i18n.language)?.lang}
      </span>

      {langs
        .filter((l) => l.value !== i18n.language)
        .map((l) => {
          return (
            <span className="lang-item" onClick={() => changeLanguage(l.value)}>
              {l.lang}
            </span>
          );
        })}
    </div>
  );
}
