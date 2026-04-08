"use client";

import posthog from "posthog-js";

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): void {
  posthog.capture(name, properties);
}
