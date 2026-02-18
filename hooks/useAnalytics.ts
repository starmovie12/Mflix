"use client";

import { useCallback } from "react";

type EventName =
  | "page_view"
  | "play_content"
  | "add_to_list"
  | "remove_from_list"
  | "search"
  | "share"
  | "profile_select"
  | "trailer_play"
  | "player_play"
  | "player_pause"
  | "player_seek"
  | "player_fullscreen"
  | "player_speed_change";

interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, string | number | boolean>;
}

function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.debug("[Analytics]", event.name, event.properties);
  }

  // Integration point for analytics providers (Amplitude, Mixpanel, GA4, etc.)
  // window.gtag?.('event', event.name, event.properties);
}

export function useAnalytics() {
  const track = useCallback((name: EventName, properties?: Record<string, string | number | boolean>) => {
    trackEvent({ name, properties });
  }, []);

  return { track };
}
