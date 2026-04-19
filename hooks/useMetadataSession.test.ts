"use client";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useMetadataSession } from "./useMetadataSession";

describe("useMetadataSession", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("createSession posts file and returns parsed result", async () => {
    const payload = {
      technicalInfo: null,
      unifiedMetadata: {},
      metadataFormat: {},
      headers: {},
      rawMetadata: {},
      formatPriorities: {},
      sessionToken: "stok",
      sessionExpiresInSeconds: 900,
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useMetadataSession());
    const file = new File([], "x.mp3", { type: "audio/mpeg" });

    let created: Awaited<ReturnType<typeof result.current.createSession>>;
    await act(async () => {
      created = await result.current.createSession(file);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: FormData },
    ];
    expect(call[0]).toBe("https://api.test/v1/audio/metadata/session/");
    expect(call[1].method).toBe("POST");
    expect(call[1].body).toBeInstanceOf(FormData);
    expect(created!.sessionToken).toBe("stok");
    expect(created!.sessionExpiresInSeconds).toBe(900);
  });

  it("downloadTaggedFile returns blob and filename from headers", async () => {
    const blob = new Blob(["x"], { type: "audio/mpeg" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        "Content-Disposition": 'attachment; filename="out.mp3"',
      }),
      blob: async () => blob,
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useMetadataSession());

    let out: Awaited<ReturnType<typeof result.current.downloadTaggedFile>>;
    await act(async () => {
      out = await result.current.downloadTaggedFile("tok", { title: "T" });
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/v1/audio/metadata/session-download/",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "T", sessionToken: "tok" }),
      }),
    );
    expect(out!.filename).toBe("out.mp3");
    expect(out!.blob).toBe(blob);
  });

  it("downloadTaggedFile throws SessionExpiredError on 410", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 410,
      text: async () => "gone",
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useMetadataSession());

    await act(async () => {
      await expect(
        result.current.downloadTaggedFile("tok", {}),
      ).rejects.toThrow(/Session expired/i);
    });

    await waitFor(() => {
      expect(result.current.error?.message).toMatch(/Session expired/i);
    });
  });
});
