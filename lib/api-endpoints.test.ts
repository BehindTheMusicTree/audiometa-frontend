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

  it("joins derived base, segment, and path with normalized slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataFullUrl()).toBe(
      "https://hear-api.themusictree.org/v1/audio/metadata/full/",
    );
  });

  it("uses staging subdomain when deployment is not production", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataFullUrl()).toBe(
      "https://staging.hear-api.themusictree.org/v1/audio/metadata/full/",
    );
  });

  it("uses NEXT_PUBLIC_BACKEND_URL when set, ignoring derived host", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "preview");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "http://127.0.0.1:8000/");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataFullUrl()).toBe(
      "http://127.0.0.1:8000/v1/audio/metadata/full/",
    );
  });

  it("trims whitespace on segment", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "  my-segment  ");
    expect(buildAudioMetadataFullUrl()).toBe(
      "https://hear-api.themusictree.org/my-segment/audio/metadata/full/",
    );
  });

  it("strips leading and trailing slashes from segment", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "/root/");
    expect(buildAudioMetadataFullUrl()).toBe(
      "https://hear-api.themusictree.org/root/audio/metadata/full/",
    );
  });

  it("throws when segment is empty after trim", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "   ");
    expect(() => buildAudioMetadataFullUrl()).toThrow();
  });
});

describe("buildAudioMetadataSessionUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds session path", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataSessionUrl()).toBe(
      "https://hear-api.themusictree.org/v1/audio/metadata/session/",
    );
  });
});

describe("buildAudioMetadataSessionDownloadUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds session-download path", () => {
    vi.stubEnv("NEXT_PUBLIC_DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_BACKEND_ROOT_SEGMENT", "v1");
    expect(buildAudioMetadataSessionDownloadUrl()).toBe(
      "https://hear-api.themusictree.org/v1/audio/metadata/session-download/",
    );
  });
});
