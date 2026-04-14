# Demo assets

## `audiometa-hero-demo-messy-tags.mp3`

Short synthetic MP3 (~3s tone) with **intentionally rough metadata**. Use this for **Playwright** (`demo/e2e/hero-demo.spec.ts`) so uploads stay fast.

## `audiometa-hero-demo-messy-tags-2m30.mp3`

Same metadata pattern, **~2 min 30 s** of synthetic tone — for **manual** captures or long-form demos where you need real duration without a rights-bearing track.

**Embedded tags (before edit)**

| Field   | Value |
|---------|--------|
| Title   | Untitled |
| Artist  | *(missing)* |
| Album   | dem0_album_wip |
| Genre   | misc |
| Date    | 0000 |
| Track   | 0 |
| Comment | fix tags before release |

**Suggested on-screen edits for the hero clip**

- Title → a real title (e.g. `Portfolio Demo C`)
- Artists → add at least one (e.g. `Your Name`)
- Album → fix typo/style (e.g. `Demo Album`)
- Genre / date / track → sensible values

Regenerate **both** files from the repo root:

```bash
npm run demo:assets
```

or:

```bash
./demo/generate-hero-demo-mp3.sh
```

See [WEB_VIDEO_DEMOS.md](../WEB_VIDEO_DEMOS.md) for formats, capture, and embedding.
