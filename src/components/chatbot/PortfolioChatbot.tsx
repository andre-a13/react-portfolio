import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { LoaderCircle, RotateCcw, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ChatbotServiceError,
  sendChatbotMessage,
} from "../../services/chatbot.service";
import type { ChatbotMessage } from "../../services/chatbot.service";
import {
  analyticsLengthBucket,
  trackAnalyticsEvent,
  type AnalyticsItem,
} from "../../services/analytics.service";
import "./portfolio-chatbot.scss";

const MAX_QUESTIONS = 10;
const MAX_CHARACTERS = 800;

type PortfolioChatbotProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PortfolioChatbot({ isOpen, onClose }: PortfolioChatbotProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const limitTrackedRef = useRef(false);

  const questionCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages],
  );
  const hasReachedLimit = questionCount >= MAX_QUESTIONS;
  const suggestions = [
    { content: t("chatbot.suggestions.fullstack"), item: "fullstack_suggestion" as const },
    { content: t("chatbot.suggestions.product"), item: "product_suggestion" as const },
    { content: t("chatbot.suggestions.project"), item: "project_suggestion" as const },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, isSending, messages]);

  useEffect(() => {
    if (hasReachedLimit && !limitTrackedRef.current) {
      limitTrackedRef.current = true;
      trackAnalyticsEvent("assistant_error", { outcome: "limit_reached" });
    }
    if (!hasReachedLimit) limitTrackedRef.current = false;
  }, [hasReachedLimit]);

  function resetConversation() {
    trackAnalyticsEvent("assistant_reset");
    setMessages([]);
    setDraft("");
    setErrorCode(null);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function sendMessage(
    content: string,
    inputMethod: "suggestion" | "typed" = "typed",
    suggestionItem?: AnalyticsItem,
  ) {
    if (!content || isSending || hasReachedLimit) return;

    if (suggestionItem) {
      trackAnalyticsEvent("assistant_suggestion_clicked", { item: suggestionItem });
    }
    trackAnalyticsEvent("assistant_question_sent", {
      input_method: inputMethod,
      length_bucket: analyticsLengthBucket(content.length),
    });

    const nextMessages: ChatbotMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setErrorCode(null);
    setIsSending(true);

    try {
      const reply = await sendChatbotMessage(nextMessages);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
      trackAnalyticsEvent("assistant_response_received", { outcome: "success" });
    } catch (requestError) {
      const code = requestError instanceof ChatbotServiceError ? requestError.code : "unavailable";
      setErrorCode(code);
      trackAnalyticsEvent("assistant_error", {
        outcome: code === "rate_limited" ? "rate_limited" : "error",
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft.trim());
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  if (!isOpen) return null;

  return (
    <aside className="portfolio-chatbot" aria-label={t("chatbot.panelLabel")}>
      <header className="portfolio-chatbot__header">
        <div>
          <h2>{t("chatbot.title")}</h2>
          <p>{t("chatbot.subtitle")}</p>
        </div>
        <div className="portfolio-chatbot__header-actions">
          {messages.length > 0 && (
            <button type="button" onClick={resetConversation} aria-label={t("chatbot.reset")} title={t("chatbot.reset")}>
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={onClose} aria-label={t("chatbot.close")} title={t("chatbot.close")}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="portfolio-chatbot__conversation">
        {messages.length === 0 ? (
          <div className="portfolio-chatbot__welcome">
            <span className="portfolio-chatbot__eyebrow">01 — {t("chatbot.title")}</span>
            <h3>{t("chatbot.welcomeTitle")}</h3>
            <p>{t("chatbot.welcomeText")}</p>
            <div className="portfolio-chatbot__suggestions" aria-label={t("chatbot.suggestionLabel")}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.item}
                  type="button"
                  onClick={() =>
                    void sendMessage(suggestion.content, "suggestion", suggestion.item)
                  }
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  {suggestion.content}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="portfolio-chatbot__messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div
                className={`portfolio-chatbot__message portfolio-chatbot__message--${message.role}`}
                key={`${message.role}-${index}`}
              >
                <span className="visually-hidden">
                  {message.role === "user" ? t("chatbot.userLabel") : t("chatbot.assistantLabel")}:
                </span>
                {message.content}
              </div>
            ))}
            {isSending && (
              <div className="portfolio-chatbot__message portfolio-chatbot__message--assistant portfolio-chatbot__message--loading">
                <LoaderCircle size={17} aria-hidden="true" />
                <span>{t("chatbot.sending")}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {errorCode && (
        <p className="portfolio-chatbot__status portfolio-chatbot__status--error" role="alert">
          {t(`chatbot.errors.${errorCode}`)}
        </p>
      )}

      {hasReachedLimit ? (
        <div className="portfolio-chatbot__limit" role="status">
          <div>
            <strong>{t("chatbot.limitTitle")}</strong>
            <p>{t("chatbot.limitText")}</p>
          </div>
          <button type="button" onClick={resetConversation}>{t("chatbot.restart")}</button>
        </div>
      ) : (
        <form className="portfolio-chatbot__form" onSubmit={handleSubmit}>
          <label htmlFor="portfolio-chatbot-input">{t("chatbot.inputLabel")}</label>
          <div className="portfolio-chatbot__composer">
            <textarea
              id="portfolio-chatbot-input"
              ref={inputRef}
              value={draft}
              maxLength={MAX_CHARACTERS}
              rows={2}
              disabled={isSending}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={t("chatbot.placeholder")}
            />
            <button type="submit" disabled={!draft.trim() || isSending} aria-label={t("chatbot.send")}>
              {isSending ? (
                <LoaderCircle className="portfolio-chatbot__spinner" size={18} aria-hidden="true" />
              ) : (
                <Send size={18} aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="portfolio-chatbot__form-meta">
            <span>{draft.length}/{MAX_CHARACTERS}</span>
            <span>{t("chatbot.counter", { count: questionCount, max: MAX_QUESTIONS })}</span>
          </div>
        </form>
      )}
    </aside>
  );
}
