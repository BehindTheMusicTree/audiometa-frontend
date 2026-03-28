import { describe, expect, it } from "vitest";
import { AudioMetadataDetailedSchema } from "./audio-metadata";

describe("AudioMetadataDetailedSchema", () => {
  it("accepts technicalInfo.isFlacMd5Valid null (non-FLAC / unknown from backend)", () => {
    const data = {
      unifiedMetadata: { title: "T" },
      technicalInfo: {
        durationSeconds: 181.69,
        bitrateBps: 320000,
        sampleRateHz: 44100,
        channels: 2,
        fileSizeBytes: 1,
        fileExtension: ".mp3",
        audioFormatName: "MP3",
        isFlacMd5Valid: null,
      },
      metadataFormat: {},
      headers: {},
      rawMetadata: {},
      formatPriorities: {},
    };
    const parsed = AudioMetadataDetailedSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });
});
