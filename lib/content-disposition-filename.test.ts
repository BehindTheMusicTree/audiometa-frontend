import { describe, expect, it } from "vitest";
import { parseContentDispositionFilename } from "./content-disposition-filename";

describe("parseContentDispositionFilename", () => {
  it("parses quoted filename", () => {
    expect(
      parseContentDispositionFilename(
        'attachment; filename="my track.mp3"',
      ),
    ).toBe("my track.mp3");
  });

  it("parses unquoted filename", () => {
    expect(
      parseContentDispositionFilename("attachment; filename=track.flac"),
    ).toBe("track.flac");
  });

  it("returns null when header missing", () => {
    expect(parseContentDispositionFilename(null)).toBeNull();
  });
});
