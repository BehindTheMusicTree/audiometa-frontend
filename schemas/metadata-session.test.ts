import { describe, expect, it } from "vitest";
import {
  parseMetadataSessionResponse,
  SessionExpiredError,
} from "./metadata-session";

const minimalMetadata = {
  unifiedMetadata: {},
  metadataFormat: {},
  headers: {},
  rawMetadata: {},
  formatPriorities: {},
};

describe("parseMetadataSessionResponse", () => {
  it("accepts camelCase session fields and returns metadata", () => {
    const result = parseMetadataSessionResponse({
      ...minimalMetadata,
      sessionToken: "tok123",
      sessionExpiresInSeconds: 900,
    });
    expect(result.sessionToken).toBe("tok123");
    expect(result.sessionExpiresInSeconds).toBe(900);
    expect(result.metadata.unifiedMetadata).toEqual({});
  });

  it("accepts snake_case session fields", () => {
    const result = parseMetadataSessionResponse({
      ...minimalMetadata,
      session_token: "abc",
      session_expires_in_seconds: 600,
    });
    expect(result.sessionToken).toBe("abc");
    expect(result.sessionExpiresInSeconds).toBe(600);
  });

  it("throws when token missing", () => {
    expect(() =>
      parseMetadataSessionResponse({
        ...minimalMetadata,
        sessionExpiresInSeconds: 900,
      }),
    ).toThrow("Invalid response");
  });
});

describe("SessionExpiredError", () => {
  it("has expected name and message", () => {
    const e = new SessionExpiredError();
    expect(e.name).toBe("SessionExpiredError");
    expect(e.message).toMatch(/upload/i);
  });
});
