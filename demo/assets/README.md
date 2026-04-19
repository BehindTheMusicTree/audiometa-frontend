# Demo assets

## `audiometa-hero-demo-messy-tags.mp3`

Short synthetic MP3 (~3s tone) with **intentionally rough metadata** for screen recordings and portfolio hero demos: easy to show a clear before/after when editing tags in Audiometa.

**Embedded tags (before edit)**

| Field   | Value |
|---------|--------|
| Title   | Untitled |
| Artist  | *(missing)* |
| Album   | dem0_album_wip |
| Genre   | misc |
| Date    | 0000 |
| Track   | 0 |
| Comment | fix tags before release — source unknown |

**Suggested on-screen edits for the hero clip**

- Title → a real title (e.g. `Portfolio Demo C`)
- Artists → add at least one (e.g. `Your Name`)
- Album → fix typo/style (e.g. `Demo Album`)
- Genre / date / track → sensible values

Regenerate from the repo root:

```bash
npm run demo:assets
```

or:

```bash
./demo/assets/generate-hero-demo-mp3.sh
```

See [WEB_VIDEO_DEMOS.md](../WEB_VIDEO_DEMOS.md) for formats, capture, and embedding.
