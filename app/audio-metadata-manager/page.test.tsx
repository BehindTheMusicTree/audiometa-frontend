"use client";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import MetadataManagerPage from "./page";

const getMetadataMock = vi.fn();
vi.mock("@/hooks/useGetFullMetadata", () => ({
  useGetFullMetadata: () => ({
    getMetadata: getMetadataMock,
    isPending: false,
    error: null,
  }),
}));

describe("MetadataManagerPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    getMetadataMock.mockClear();
  });

  it("renders the heading Metadata Manager", () => {
    render(<MetadataManagerPage />);
    expect(
      screen.getByRole("heading", { name: /audio metadata manager/i }),
    ).toBeInTheDocument();
  });

  it("shows No metadata when no file has been processed", () => {
    render(<MetadataManagerPage />);
    const noMetadataElements = screen.getAllByText("No metadata");
    expect(noMetadataElements.length).toBeGreaterThanOrEqual(6);
  });

  it("renders all metadata section headings", () => {
    render(<MetadataManagerPage />);
    const sectionTitles = [
      "Technical information",
      "Unified metadata",
      "By metadata format",
      "Format priorities",
      "Formats headers",
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

  it("calls getMetadata with selected file when user selects a file", async () => {
    getMetadataMock.mockResolvedValue({});
    render(<MetadataManagerPage />);
    const input = screen.getByLabelText(/choose an audio file/i);
    const file = new File([], "test.mp3", { type: "audio/mpeg" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(getMetadataMock).toHaveBeenCalledTimes(1);
    expect(getMetadataMock).toHaveBeenCalledWith(file);
  });
});
