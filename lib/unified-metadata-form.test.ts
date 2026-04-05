import { describe, it, expect } from "vitest";
import {
  buildUnifiedMetadataDownloadBody,
  buildUnifiedFormStateFromSession,
  initialVisibleFieldIds,
  unifiedFieldIdToJsonKey,
} from "./unified-metadata-form";

describe("unifiedFieldIdToJsonKey", () => {
  it("camelCases snake_case ids", () => {
    expect(unifiedFieldIdToJsonKey("musicbrainz_trackid")).toBe(
      "musicbrainzTrackid",
    );
    expect(unifiedFieldIdToJsonKey("title")).toBe("title");
  });
});

describe("initialVisibleFieldIds", () => {
  it("prefers fields with values", () => {
    const supported = new Set(["title", "composer", "album"]);
    const ids = initialVisibleFieldIds({ title: "A", composer: ["B"] }, supported);
    expect(ids).toContain("title");
    expect(ids).toContain("composer");
    expect(ids).not.toContain("album");
  });
});

describe("buildUnifiedMetadataDownloadBody", () => {
  it("maps ids to camelCase JSON keys", () => {
    const schemaById = new Map([
      [
        "musicbrainz_trackid",
        {
          id: "musicbrainz_trackid",
          label: "MB",
          multiple: false,
          valueType: "string",
        },
      ],
    ]);
    const body = buildUnifiedMetadataDownloadBody(
      ["musicbrainz_trackid"],
      { musicbrainz_trackid: "abc" },
      schemaById,
    );
    expect(body.musicbrainzTrackid).toBe("abc");
  });
});

describe("buildUnifiedFormStateFromSession", () => {
  it("returns null when schema missing", () => {
    expect(buildUnifiedFormStateFromSession({ unifiedMetadata: {} })).toBeNull();
  });

  it("builds state when schema and supported ids present", () => {
    const raw = {
      unifiedMetadataFieldSchema: [
        { id: "title", label: "Title", multiple: false, valueType: "string" },
      ],
      supportedUnifiedMetadataFieldIds: ["title"],
      unifiedMetadata: { title: "Hi" },
    };
    const s = buildUnifiedFormStateFromSession(raw);
    expect(s).not.toBeNull();
    expect(s!.visibleFieldIds).toContain("title");
    expect(s!.values.title).toBe("Hi");
  });
});
