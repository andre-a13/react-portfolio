export type AnalyticsEventName =
  | "visit_started"
  | "visit_ended"
  | "chapter_viewed"
  | "skill_selected"
  | "experience_selected"
  | "project_selected"
  | "language_changed"
  | "cv_opened"
  | "assistant_opened"
  | "assistant_closed"
  | "assistant_suggestion_clicked"
  | "assistant_question_sent"
  | "assistant_response_received"
  | "assistant_error"
  | "assistant_reset"
  | "contact_clicked";

export type AnalyticsRoute = "/" | "/privacy" | "/cv" | "/cv/microsoft" | "/cv/full-stack";
export type AnalyticsLanguage = "fr" | "en";
export type AnalyticsChapter = "profile" | "skills" | "experience" | "contact";
export type AnalyticsItem =
  | "frontend"
  | "microsoft"
  | "cloud"
  | "delivery"
  | "collaboration"
  | "pwc"
  | "webexpr"
  | "intranet"
  | "hr_tools"
  | "alteryx"
  | "trpg"
  | "portfolio_assistant"
  | "general_cv"
  | "microsoft_cv"
  | "full_stack_cv"
  | "email"
  | "linkedin"
  | "github"
  | "fullstack_suggestion"
  | "product_suggestion"
  | "project_suggestion";

type DeviceCategory = "mobile" | "tablet" | "desktop";
type SourceCategory = "direct" | "linkedin" | "github" | "search" | "campaign" | "other";
type InputMethod = "suggestion" | "typed";
type LengthBucket = "short" | "medium" | "long";
type Outcome = "success" | "error" | "rate_limited" | "limit_reached";
type DurationBucket = "<30s" | "30-120s" | ">120s";

export type AnalyticsEventDimensions = {
  language?: AnalyticsLanguage;
  chapter?: AnalyticsChapter;
  item?: AnalyticsItem;
  input_method?: InputMethod;
  length_bucket?: LengthBucket;
  outcome?: Outcome;
  duration_bucket?: DurationBucket;
};

type QueuedEvent = AnalyticsEventDimensions & {
  name: AnalyticsEventName;
  occurred_at: string;
  route: AnalyticsRoute;
  device_category: DeviceCategory;
  source_category?: SourceCategory;
};

export type AnalyticsPreference = "enabled" | "disabled";
export type AnalyticsPreferenceNotice = "enabled" | "disabled" | null;

const OPT_OUT_KEY = "portfolio.analytics.optout.until";
const OPT_OUT_DURATION_MS = 183 * 24 * 60 * 60 * 1000;
const FLUSH_INTERVAL_MS = 10_000;
const VISIT_INACTIVITY_MS = 30 * 60 * 1000;
const MAX_BATCH_SIZE = 20;

let visitId: string | null = null;
let visitStartedAt = 0;
let lastActivityAt = 0;
let queue: QueuedEvent[] = [];
let flushTimer: number | null = null;
let initialized = false;
let enabled = false;
let preferenceNotice: AnalyticsPreferenceNotice = null;
let sourceCategory: SourceCategory = "direct";
let isFlushing = false;
let listenersAttached = false;

function currentLanguage(): AnalyticsLanguage {
  return document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "fr";
}

function currentRoute(): AnalyticsRoute {
  const routes: AnalyticsRoute[] = ["/", "/privacy", "/cv", "/cv/microsoft", "/cv/full-stack"];
  return routes.includes(window.location.pathname as AnalyticsRoute)
    ? (window.location.pathname as AnalyticsRoute)
    : "/";
}

function deviceCategory(): DeviceCategory {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

function deriveSource(): SourceCategory {
  const campaign = new URLSearchParams(window.location.search).get("utm_source");
  if (campaign) return "campaign";
  if (!document.referrer) return "direct";

  try {
    const hostname = new URL(document.referrer).hostname.toLowerCase();
    if (hostname === window.location.hostname) return "direct";
    if (hostname.includes("linkedin")) return "linkedin";
    if (hostname.includes("github")) return "github";
    if (["google.", "bing.", "duckduckgo.", "qwant."].some((name) => hostname.includes(name))) {
      return "search";
    }
  } catch {
    return "other";
  }
  return "other";
}

function getOptOutExpiry(): number {
  const stored = window.localStorage.getItem(OPT_OUT_KEY);
  if (!stored) return 0;
  const expiry = Number(stored);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) {
    window.localStorage.removeItem(OPT_OUT_KEY);
    return 0;
  }
  return expiry;
}

function processPreferenceParameter(): void {
  const url = new URL(window.location.href);
  const preference = url.searchParams.get("analytics");
  if (preference !== "off" && preference !== "on") return;

  if (preference === "off") {
    window.localStorage.setItem(OPT_OUT_KEY, String(Date.now() + OPT_OUT_DURATION_MS));
    preferenceNotice = "disabled";
  } else {
    window.localStorage.removeItem(OPT_OUT_KEY);
    preferenceNotice = "enabled";
  }

  url.searchParams.delete("analytics");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function privacySignalEnabled(): boolean {
  const privacyNavigator = navigator as Navigator & { globalPrivacyControl?: boolean };
  return privacyNavigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
}

function canCollect(): boolean {
  const hostname = window.location.hostname;
  return Boolean(import.meta.env.VITE_ANALYTICS_API_URL)
    && import.meta.env.VITE_ANALYTICS_DISABLED !== "true"
    && hostname !== "localhost"
    && hostname !== "127.0.0.1"
    && !privacySignalEnabled()
    && getOptOutExpiry() === 0;
}

function durationBucket(): DurationBucket {
  const seconds = (Date.now() - visitStartedAt) / 1000;
  if (seconds < 30) return "<30s";
  if (seconds <= 120) return "30-120s";
  return ">120s";
}

function newVisit(): void {
  visitId = crypto.randomUUID();
  visitStartedAt = Date.now();
  lastActivityAt = visitStartedAt;
  enqueue("visit_started", {}, false);
}

function rotateInactiveVisit(): void {
  if (!visitId || Date.now() - lastActivityAt < VISIT_INACTIVITY_MS) return;
  enqueue("visit_ended", { duration_bucket: durationBucket() }, false);
  void flushAnalytics();
  newVisit();
}

function enqueue(
  name: AnalyticsEventName,
  dimensions: AnalyticsEventDimensions,
  checkInactivity = true,
): void {
  if (!enabled || !visitId) return;
  if (checkInactivity) rotateInactiveVisit();
  lastActivityAt = Date.now();
  queue.push({
    name,
    occurred_at: new Date().toISOString(),
    route: currentRoute(),
    language: dimensions.language ?? currentLanguage(),
    device_category: deviceCategory(),
    ...(name === "visit_started" ? { source_category: sourceCategory } : {}),
    ...dimensions,
  });
  if (queue.length >= MAX_BATCH_SIZE) void flushAnalytics();
}

function payloadFor(batchVisitId: string, events: QueuedEvent[]): string {
  return JSON.stringify({ schema_version: 1, visit_id: batchVisitId, events });
}

export async function flushAnalytics(useBeacon = false): Promise<void> {
  if (!enabled || !visitId || queue.length === 0 || isFlushing) return;
  const endpoint = import.meta.env.VITE_ANALYTICS_API_URL;
  if (!endpoint) return;

  isFlushing = true;
  const batchVisitId = visitId;
  const pendingEvents = queue.splice(0, queue.length);
  try {
    while (pendingEvents.length > 0) {
      const events = pendingEvents.splice(0, MAX_BATCH_SIZE);
      const body = payloadFor(batchVisitId, events);
      if (useBeacon && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain;charset=UTF-8" }));
        continue;
      }
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      } catch {
        // Failed analytics are intentionally discarded and never persisted.
      }
    }
  } finally {
    isFlushing = false;
  }
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  dimensions: AnalyticsEventDimensions = {},
): void {
  enqueue(name, dimensions);
}

export function analyticsLengthBucket(length: number): LengthBucket {
  if (length <= 120) return "short";
  if (length <= 400) return "medium";
  return "long";
}

export function getAnalyticsPreference(): AnalyticsPreference {
  return getOptOutExpiry() > 0 ? "disabled" : "enabled";
}

export function setAnalyticsPreference(preference: AnalyticsPreference): void {
  if (preference === "disabled") {
    window.localStorage.setItem(OPT_OUT_KEY, String(Date.now() + OPT_OUT_DURATION_MS));
    enabled = false;
    queue = [];
    visitId = null;
  } else {
    window.localStorage.removeItem(OPT_OUT_KEY);
    enabled = canCollect();
    if (enabled && !visitId) startCollection();
  }
  preferenceNotice = preference;
  window.dispatchEvent(new CustomEvent("analytics-preference-changed", { detail: preference }));
}

export function consumeAnalyticsPreferenceNotice(): AnalyticsPreferenceNotice {
  const notice = preferenceNotice;
  preferenceNotice = null;
  return notice;
}

export function initializeAnalytics(): void {
  if (initialized) return;
  initialized = true;
  processPreferenceParameter();
  sourceCategory = deriveSource();
  enabled = canCollect();
  if (!enabled) return;

  startCollection();
}

function handleVisibilityChange(): void {
  if (document.visibilityState === "hidden") void flushAnalytics(true);
}

function handlePageHide(): void {
  trackAnalyticsEvent("visit_ended", { duration_bucket: durationBucket() });
  void flushAnalytics(true);
}

function startCollection(): void {
  newVisit();
  if (flushTimer === null) {
    flushTimer = window.setInterval(() => void flushAnalytics(), FLUSH_INTERVAL_MS);
  }
  if (!listenersAttached) {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    listenersAttached = true;
  }
}

export function stopAnalytics(): void {
  if (flushTimer !== null) window.clearInterval(flushTimer);
  flushTimer = null;
  initialized = false;
  enabled = false;
  visitId = null;
  queue = [];
  isFlushing = false;
  if (listenersAttached) {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
    listenersAttached = false;
  }
}
