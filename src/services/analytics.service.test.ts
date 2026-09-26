// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://arnaud-a.dev/"}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  flushAnalytics,
  initializeAnalytics,
  stopAnalytics,
  trackAnalyticsEvent,
} from "./analytics.service";

const endpoint = "https://ai.arnaud-a.dev/analytics/events";

function setPrivacySignals(globalPrivacyControl = false, doNotTrack: string | null = null) {
  Object.defineProperty(navigator, "globalPrivacyControl", {
    configurable: true,
    value: globalPrivacyControl,
  });
  Object.defineProperty(navigator, "doNotTrack", {
    configurable: true,
    value: doNotTrack,
  });
}

function requestPayload(fetchMock: ReturnType<typeof vi.fn>, call = 0) {
  const options = fetchMock.mock.calls[call][1] as RequestInit;
  return JSON.parse(String(options.body));
}

describe("anonymous portfolio analytics", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    stopAnalytics();
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    setPrivacySignals();
    vi.stubEnv("VITE_ANALYTICS_API_URL", endpoint);
    vi.stubEnv("VITE_ANALYTICS_DISABLED", "false");
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    stopAnalytics();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not call the API when collection is disabled", async () => {
    vi.stubEnv("VITE_ANALYTICS_DISABLED", "true");
    initializeAnalytics();
    trackAnalyticsEvent("chapter_viewed", { chapter: "skills" });
    await flushAnalytics();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    [true, null],
    [false, "1"],
  ])("respects browser privacy signals", async (gpc, dnt) => {
    setPrivacySignals(gpc, dnt);
    initializeAnalytics();
    trackAnalyticsEvent("chapter_viewed", { chapter: "skills" });
    await flushAnalytics();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("applies analytics=off before collection and removes it from the URL", async () => {
    window.history.replaceState({}, "", "/?campaign=test&analytics=off#profile");
    initializeAnalytics();
    await flushAnalytics();

    expect(window.location.href).toBe("https://arnaud-a.dev/?campaign=test#profile");
    expect(localStorage.length).toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the visit id in memory and creates a new one after reload", async () => {
    initializeAnalytics();
    await flushAnalytics();
    const firstVisitId = requestPayload(fetchMock).visit_id;

    expect(localStorage.length).toBe(0);

    stopAnalytics();
    initializeAnalytics();
    await flushAnalytics();
    const secondVisitId = requestPayload(fetchMock, 1).visit_id;

    expect(firstVisitId).not.toBe(secondVisitId);
    expect(localStorage.length).toBe(0);
  });

  it("sends only enumerated dimensions and never the question content", async () => {
    initializeAnalytics();
    trackAnalyticsEvent("assistant_question_sent", {
      input_method: "typed",
      length_bucket: "medium",
    });
    await flushAnalytics();

    const payload = requestPayload(fetchMock);
    const questionEvent = payload.events.find(
      (event: { name: string }) => event.name === "assistant_question_sent",
    );
    expect(questionEvent).toMatchObject({
      route: "/",
      input_method: "typed",
      length_bucket: "medium",
    });
    expect(JSON.stringify(payload)).not.toContain("question content");
    expect(questionEvent).not.toHaveProperty("content");
    expect(questionEvent).not.toHaveProperty("url");
  });

  it("batches representative portfolio interactions", async () => {
    initializeAnalytics();
    trackAnalyticsEvent("chapter_viewed", { chapter: "experience" });
    trackAnalyticsEvent("experience_selected", { item: "pwc" });
    trackAnalyticsEvent("project_selected", { item: "portfolio_assistant" });
    trackAnalyticsEvent("assistant_opened");
    trackAnalyticsEvent("contact_clicked", { item: "linkedin" });
    await flushAnalytics();

    const names = requestPayload(fetchMock).events.map(
      (event: { name: string }) => event.name,
    );
    expect(names).toEqual([
      "visit_started",
      "chapter_viewed",
      "experience_selected",
      "project_selected",
      "assistant_opened",
      "contact_clicked",
    ]);
  });
});
