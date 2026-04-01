import { describe, expect, it } from "vitest";
import {
  buildWritableMetadataDownloadBody,
  writableTagsFromSessionJson,
} from "./metadata-writable-tags";

describe("writableTagsFromSessionJson", () => {
  it("maps camelCase root fields", () => {
    const s = writableTagsFromSessionJson({
      title: "T",
      artistsNames: ["A", "B"],
      albumName: "Al",
      albumArtistsNames: ["X"],
      genresNames: ["Rock"],
      rating: 50,
      language: "en",
    });
    expect(s.title).toBe("T");
    expect(s.artistsNames).toEqual(["A", "B"]);
    expect(s.rating).toBe("50");
  });

  it("maps snake_case root fields", () => {
    const s = writableTagsFromSessionJson({
      title: "T",
      artists_names: ["One"],
      album_name: "Alb",
      album_artists_names: [],
      genres_names: ["G"],
      language: "fr",
    });
    expect(s.artistsNames).toEqual(["One"]);
    expect(s.albumName).toBe("Alb");
  });
});

describe("buildWritableMetadataDownloadBody", () => {
  it("outputs camelCase keys and clamps rating", () => {
    const body = buildWritableMetadataDownloadBody({
      title: "  Hi  ",
      artistsNames: [" a ", ""],
      albumName: "Al",
      albumArtistsNames: [""],
      genresNames: ["x"],
      rating: "150",
      language: "en",
    });
    expect(body.title).toBe("Hi");
    expect(body.artistsNames).toEqual(["a"]);
    expect(body.rating).toBe(100);
  });

  it("sets rating null when empty", () => {
    const body = buildWritableMetadataDownloadBody({
      title: "",
      artistsNames: [""],
      albumName: "",
      albumArtistsNames: [""],
      genresNames: [""],
      rating: "",
      language: "",
    });
    expect(body.rating).toBeNull();
  });
});
