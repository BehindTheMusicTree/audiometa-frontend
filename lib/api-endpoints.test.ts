import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildAudioMetadataFullUrl,
  buildAudioMetadataSessionDownloadUrl,
  buildAudioMetadataSessionUrl,
} from "./api-endpoints";

describe("buildAudioMetadataFullUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("joins base, segment, and path with normalized slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataFullUrl()).toBe("https://api.test/v1/full/");
  });

  it("trims whitespace on base and segment", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "  https://api.test/  ");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "  my-segment  ");
    expect(buildAudioMetadataFullUrl()).toBe(
      "https://api.test/my-segment/full/",
    );
  });

  it("strips leading and trailing slashes from segment", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "/root/");
    expect(buildAudioMetadataFullUrl()).toBe("https://api.test/root/full/");
  });

  it("throws when segment is empty after trim", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "   ");
    expect(() => buildAudioMetadataFullUrl()).toThrow();
  });

  it("throws when base is empty after trim", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "   ");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(() => buildAudioMetadataFullUrl()).toThrow();
  });
});

describe("buildAudioMetadataSessionUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds session path", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataSessionUrl()).toBe("https://api.test/v1/session/");
  });
});

describe("buildAudioMetadataSessionDownloadUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds session-download path", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "https://api.test");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataSessionDownloadUrl()).toBe(
      "https://api.test/v1/session-download/",
    );
  });
});
