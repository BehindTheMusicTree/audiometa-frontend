import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import PageFooter from "./PageFooter";
import en from "../messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const trackMock = vi.fn();
vi.mock("@/lib/track-event", () => ({
  trackEvent: (...args: unknown[]) => trackMock(...args),
}));

function renderFooter() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <PageFooter audiometaPythonGithubUrl="https://github.com/example/audiometa-python" />
    </NextIntlClientProvider>,
  );
}

describe("PageFooter", () => {
  afterEach(cleanup);

  beforeEach(() => {
    trackMock.mockClear();
  });

  it("tracks a click on the Tipeee link", () => {
    renderFooter();
    fireEvent.click(
      screen.getByRole("link", { name: /support us on tipeee/i }),
    );
    expect(trackMock).toHaveBeenCalledWith("footer_tipeee_click");
  });

  it("tracks a click on the AudioMeta Python GitHub link", () => {
    renderFooter();
    fireEvent.click(
      screen.getByRole("link", { name: /audiometa python on github/i }),
    );
    expect(trackMock).toHaveBeenCalledWith("footer_github_click");
  });
});
