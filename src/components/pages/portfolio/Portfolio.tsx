import "@fontsource-variable/manrope";
import { FileUser, MessageSquareText } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import PortfolioChatbot from "../../chatbot/PortfolioChatbot";
import Content from "../../content/content";
import LangSwitch from "../../lang-switch/LangSwitch";
import { trackAnalyticsEvent } from "../../../services/analytics.service";
import "./portfolio.scss";

function Portfolio() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith("en") ? "en" : "fr";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lastChatTrigger = useRef<HTMLButtonElement | null>(null);

  const openChat = useCallback((trigger: HTMLButtonElement) => {
    lastChatTrigger.current = trigger;
    setIsChatOpen(true);
    trackAnalyticsEvent("assistant_opened");
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    trackAnalyticsEvent("assistant_closed");
    window.requestAnimationFrame(() => lastChatTrigger.current?.focus());
  }, []);

  return (
    <div className={`portfolio-shell${isChatOpen ? " portfolio-shell--chat-open" : ""}`}>
      <a className="portfolio-skip-link" href="#portfolio-main">{t("portfolio.skipLink")}</a>

      <header className="portfolio-header">
        <Link className="portfolio-brand" to="/" aria-label={t("portfolio.header.homeLabel")}>
          <span aria-hidden="true">AA</span>
          <strong>Arnaud André</strong>
        </Link>

        <div className="portfolio-header__actions">
          <LangSwitch />
          <Link
            className="portfolio-header__resume"
            to={`/cv/full-stack?lang=${language}`}
          >
            <FileUser size={17} aria-hidden="true" />
            <span>{t("portfolio.header.resume")}</span>
          </Link>
          <button className="portfolio-header__ask" type="button" onClick={(event) => openChat(event.currentTarget)}>
            <MessageSquareText size={17} aria-hidden="true" />
            <span>{t("portfolio.header.ask")}</span>
          </button>
        </div>
      </header>

      <main id="portfolio-main" className="portfolio-main">
        <Content onOpenChat={openChat} />
      </main>

      <PortfolioChatbot isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}

export default Portfolio;
