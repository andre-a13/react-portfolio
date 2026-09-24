export type ChatbotMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatbotErrorCode =
  | "configuration"
  | "invalid_request"
  | "rate_limited"
  | "unavailable"
  | "empty_response";

type ChatbotResponse = {
  reply: string;
  thread_id: string;
  run_id: string;
};

const LOCAL_CHATBOT_URL = "http://127.0.0.1:8010/chat";

export class ChatbotServiceError extends Error {
  readonly code: ChatbotErrorCode;
  readonly status?: number;

  constructor(code: ChatbotErrorCode, status?: number) {
    super(code);
    this.name = "ChatbotServiceError";
    this.code = code;
    this.status = status;
  }
}

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getChatbotUrl() {
  const configuredUrl = (import.meta.env.VITE_CHATBOT_API_URL as string | undefined)?.trim();
  if (configuredUrl) return trimTrailingSlash(configuredUrl);
  if (import.meta.env.DEV) return LOCAL_CHATBOT_URL;
  throw new ChatbotServiceError("configuration");
}

function errorForStatus(status: number) {
  if (status === 400 || status === 422) {
    return new ChatbotServiceError("invalid_request", status);
  }
  if (status === 429) {
    return new ChatbotServiceError("rate_limited", status);
  }
  return new ChatbotServiceError("unavailable", status);
}

export async function sendChatbotMessage(messages: ChatbotMessage[]) {
  const chatbotUrl = getChatbotUrl();
  let response: Response;
  try {
    response = await fetch(chatbotUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
  } catch {
    throw new ChatbotServiceError("unavailable");
  }

  if (!response.ok) {
    // Consume the body without exposing provider details in the portfolio UI.
    await response.json().catch(() => null);
    throw errorForStatus(response.status);
  }

  const data = (await response.json()) as Partial<ChatbotResponse>;
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new ChatbotServiceError("empty_response", response.status);
  }

  return data.reply.trim();
}
