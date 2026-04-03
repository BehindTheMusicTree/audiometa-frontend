"use client";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import MetadataManagerPage from "./page";

const createSessionMock = vi.fn();
const downloadTaggedFileMock = vi.fn();

vi.mock("@/hooks/useMetadataSession", () => ({
  useMetadataSession: () => ({
    createSession: createSessionMock,
    downloadTaggedFile: downloadTaggedFileMock,
    isPending: false,
    isDownloadPending: false,
    error: null,
  }),
}));

const sessionResult = {
  metadata: {
    technicalInfo: null,
    unifiedMetadata: {},
    metadataFormat: {},
    headers: {},
    rawMetadata: {},
    formatPriorities: {},
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
  },
};

describe("MetadataManagerPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    createSessionMock.mockClear();
    downloadTaggedFileMock.mockClear();
    createSessionMock.mockResolvedValue(sessionResult);
  });

  it("renders the heading Metadata Manager", () => {
    render(<MetadataManagerPage />);
    expect(
      screen.getByRole("heading", { name: /audio metadata manager/i }),
    ).toBeInTheDocument();
  });

  it("renders the feature intro section", () => {
    render(<MetadataManagerPage />);
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
    const docsLink = screen.getByRole("link", { name: /^complete documentation$/i });
    expect(docsLink).toHaveAttribute("href", "/docs");
    const libLink = screen.getByRole("link", {
      name: /audiometa python library/i,
    });
    expect(libLink).toHaveAttribute(
      "href",
      "https://github.com/BehindTheMusicTree/audiometa",
    );
    expect(libLink).toHaveAttribute("target", "_blank");
    expect(libLink).toHaveAttribute("rel", "noopener noreferrer");

    const emailLink = screen.getByRole("link", {
      name: /^email us with questions$/i,
    });
    expect(emailLink.getAttribute("href")).toMatch(/^mailto:/);

    const issuesLink = screen.getByRole("link", { name: /github issues/i });
    expect(issuesLink).toHaveAttribute(
      "href",
      "https://github.com/BehindTheMusicTree/audiometa-frontend/issues",
    );
    expect(issuesLink).toHaveAttribute("target", "_blank");
    expect(issuesLink).toHaveAttribute("rel", "noopener noreferrer");

    const sponsorLink = screen.getByRole("link", {
      name: /sponsor us on github sponsors/i,
    });
    expect(sponsorLink).toHaveAttribute(
      "href",
      "https://github.com/sponsors/BehindTheMusicTree",
    );
    expect(sponsorLink).toHaveAttribute("target", "_blank");
    expect(sponsorLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows No metadata when no file has been processed", () => {
    render(<MetadataManagerPage />);
    const noMetadataElements = screen.getAllByText("No metadata");
    expect(noMetadataElements.length).toBeGreaterThanOrEqual(4);
  });

  it("renders all metadata section headings", () => {
    render(<MetadataManagerPage />);
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

  it("calls createSession with selected file when user selects a file", async () => {
    render(<MetadataManagerPage />);
    const input = screen.getByLabelText(/choose an audio file/i);
    const file = new File([], "test.mp3", { type: "audio/mpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledTimes(1);
      expect(createSessionMock).toHaveBeenCalledWith(file);
    });
  });

  it("shows Edit tags after session is created", async () => {
    render(<MetadataManagerPage />);
    const input = screen.getByLabelText(/choose an audio file/i);
    fireEvent.change(input, {
      target: { files: [new File([], "a.mp3", { type: "audio/mpeg" })] },
    });

    expect(
      await screen.findByRole("heading", { name: /^edit tags$/i }),
    ).toBeInTheDocument();
  });
});
