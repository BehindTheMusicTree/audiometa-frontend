import type { ReactElement, ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
    title,
    "aria-label": ariaLabel,
    hrefLang,
  }: {
    children: ReactNode;
    href: string;
    locale?: string;
    className?: string;
    title?: string;
    "aria-label"?: string;
    hrefLang?: string;
  }) => (
    <a
      href={href}
      className={className}
      title={title}
      aria-label={ariaLabel}
      hrefLang={hrefLang}
    >
      {children}
    </a>
  ),
  usePathname: () => "/",
}));
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import MetadataManagerPage from "./AudioMetadataManagerClient";
import en from "../../messages/en.json";

const TEST_AUDIOMETA_PYTHON_GITHUB_URL =
  "https://github.com/BehindTheMusicTree/audiometa";

const createSessionMock = vi.fn();
const downloadTaggedFileMock = vi.fn();
const trackMock = vi.fn();

vi.mock("@/hooks/useMetadataSession", () => ({
  useMetadataSession: () => ({
    createSession: createSessionMock,
    downloadTaggedFile: downloadTaggedFileMock,
    isPending: false,
    isDownloadPending: false,
    error: null,
  }),
}));

vi.mock("@/lib/track-event", () => ({
  trackEvent: (...args: unknown[]) => trackMock(...args),
}));

const UNIFIED_SCHEMA_STUB = [
  { id: "title", label: "Title", multiple: false, valueType: "string" },
  { id: "artists", label: "Artists", multiple: true, valueType: "strings" },
  { id: "album", label: "Album", multiple: false, valueType: "string" },
  {
    id: "album_artists",
    label: "Album artists",
    multiple: true,
    valueType: "strings",
  },
  { id: "genres_names", label: "Genres", multiple: true, valueType: "strings" },
  { id: "rating", label: "Rating", multiple: false, valueType: "number" },
  { id: "language", label: "Language", multiple: false, valueType: "string" },
  { id: "composer", label: "Composers", multiple: true, valueType: "strings" },
];

const SUPPORTED_STUB = UNIFIED_SCHEMA_STUB.map((x) => x.id);

const sessionResult = {
  metadata: {
    technicalInfo: null,
    unifiedMetadata: {},
    metadataFormat: {},
    headers: {},
    rawMetadata: {},
    formatPriorities: {},
    unifiedMetadataFieldSchema: UNIFIED_SCHEMA_STUB,
    supportedUnifiedMetadataFieldIds: SUPPORTED_STUB,
  },
  sessionToken: "t1",
  sessionExpiresInSeconds: 900,
  rawResponse: {
    sessionToken: "t1",
    sessionExpiresInSeconds: 900,
    technicalInfo: null,
    unifiedMetadata: {},
    metadataFormat: {},
    headers: {},
    rawMetadata: {},
    formatPriorities: {},
    unifiedMetadataFieldSchema: UNIFIED_SCHEMA_STUB,
    supportedUnifiedMetadataFieldIds: SUPPORTED_STUB,
  },
};

function renderWithIntl(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("MetadataManagerPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("ab_tipeee_cta_position", "intro_bottom");
    const matchMediaMock = vi
      .fn()
      .mockImplementation((query: string): MediaQueryList => {
        return {
          media: query,
          matches: false,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList;
      });
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
    createSessionMock.mockClear();
    downloadTaggedFileMock.mockClear();
    trackMock.mockClear();
    createSessionMock.mockResolvedValue(sessionResult);
  });

  it("renders the heading Metadata Manager", () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /audio metadata manager/i }),
    ).toBeInTheDocument();
  });

  it("renders the feature intro section", () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    expect(
      screen.getByRole("heading", {
        name: /here['\u2019]s what you can do/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /upload a track to inspect metadata, edit writable tags, and download your changes/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("MP3, FLAC, WAV")).toBeInTheDocument();
    expect(screen.getByText("RIFF, ID3v1, ID3v2, Vorbis")).toBeInTheDocument();
    const docsLink = screen.getByRole("link", {
      name: /^complete documentation$/i,
    });
    expect(docsLink).toHaveAttribute("href", "/docs");
  });

  it("shows No metadata when no file has been processed", () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const noMetadataElements = screen.getAllByText("No metadata");
    expect(noMetadataElements.length).toBeGreaterThanOrEqual(4);
  });

  it("renders all metadata section headings", () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const sectionTitles = [
      "Technical information",
      "Unified metadata",
      "By metadata format",
      "Metadata raw",
    ];
    for (const title of sectionTitles) {
      const headings = screen.getAllByRole("heading", {
        level: 2,
        name: title,
      });
      expect(headings.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("tracks choose-file button click before opening file dialog", () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const chooseButton = screen.getByRole("button", { name: /^choose file$/i });
    fireEvent.click(chooseButton);
    expect(trackMock).toHaveBeenCalledWith("metadata_choose_file_click");
  });

  it("calls createSession with selected file when user selects a file", async () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const input = screen.getByLabelText(/choose an audio file/i);
    const file = new File([], "test.mp3", { type: "audio/mpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledTimes(1);
      expect(createSessionMock).toHaveBeenCalledWith(file);
    });
  });

  it("shows Edit tags after session is created", async () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    expect(
      document.querySelector('[data-track="tipeee-cta-container"]'),
    ).toBeNull();
    const input = screen.getByLabelText(/choose an audio file/i);
    fireEvent.change(input, {
      target: { files: [new File([], "a.mp3", { type: "audio/mpeg" })] },
    });

    expect(
      await screen.findByRole("heading", { name: /^edit tags$/i }),
    ).toBeInTheDocument();
    const inFlowCtaAfterLoad = await waitFor(() => {
      const el = document.querySelector(
        '[data-track="tipeee-cta-container"]',
      ) as HTMLElement | null;
      expect(el).not.toBeNull();
      return el!;
    });
    expect(
      within(inFlowCtaAfterLoad).getByText(
        /found this useful\? support growthemusictree, our flagship project\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /support us on tipeee/i }).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("tracks metadata success, CTA impression, and click with position payload", async () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const input = screen.getByLabelText(/choose an audio file/i);
    fireEvent.change(input, {
      target: { files: [new File([], "event.mp3", { type: "audio/mpeg" })] },
    });

    await waitFor(() => {
      expect(trackMock).toHaveBeenCalledWith("metadata_load_success", {
        cta_position: "intro_bottom",
        prefers_reduced_motion: false,
      });
    });

    expect(trackMock).toHaveBeenCalledWith("tipeee_cta_impression", {
      cta_position: "intro_bottom",
      prefers_reduced_motion: false,
    });

    const inFlowCtaContainer = document.querySelector(
      '[data-track="tipeee-cta-container"]',
    );
    expect(inFlowCtaContainer).not.toBeNull();
    const inFlowLink = within(inFlowCtaContainer as HTMLElement).getByRole(
      "link",
      { name: /support us on tipeee/i },
    );
    fireEvent.click(inFlowLink!);
    expect(trackMock).toHaveBeenCalledWith("tipeee_cta_click", {
      cta_position: "intro_bottom",
      prefers_reduced_motion: false,
    });
  });

  it.each([
    { position: "intro_bottom" as const },
    { position: "after_panels" as const },
    { position: "near_download" as const },
  ])("renders CTA in only one location for $position", async ({ position }) => {
    window.localStorage.setItem("ab_tipeee_cta_position", position);
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const input = screen.getByLabelText(/choose an audio file/i);
    fireEvent.change(input, {
      target: { files: [new File([], "position.mp3", { type: "audio/mpeg" })] },
    });

    await waitFor(() => {
      expect(
        document.querySelector('[data-track="tipeee-cta-container"]'),
      ).not.toBeNull();
    });

    const prompts = screen.getAllByText(
      /found this useful\? support growthemusictree, our flagship project\./i,
    );
    const containers = prompts
      .map((prompt) => prompt.closest('[data-track="tipeee-cta-container"]'))
      .filter((container): container is HTMLElement => container !== null);
    expect(containers).toHaveLength(1);
    expect(containers[0]).toHaveAttribute("data-position", position);
  });

  it("shows add-field UI when unified schema is present", async () => {
    renderWithIntl(
      <MetadataManagerPage
        audiometaPythonGithubUrl={TEST_AUDIOMETA_PYTHON_GITHUB_URL}
      />,
    );
    const input = screen.getByLabelText(/choose an audio file/i);
    fireEvent.change(input, {
      target: { files: [new File([], "a.mp3", { type: "audio/mpeg" })] },
    });

    expect(await screen.findByText(/^add field$/i)).toBeInTheDocument();
  });
});
