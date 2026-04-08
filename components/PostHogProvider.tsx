"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname == null) return;
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    posthog.capture("$pageview", {
      $current_url: typeof window !== "undefined" ? window.location.href : path,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
