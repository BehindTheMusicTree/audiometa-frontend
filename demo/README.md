# Demo

Everything for **screen recordings, portfolio clips, and embeddable video** for Audiometa lives under this folder.

| Path | Purpose |
|------|---------|
| [WEB_VIDEO_DEMOS.md](./WEB_VIDEO_DEMOS.md) | Formats (MP4 vs GIF, etc.), capture tips, Playwright + ffmpeg workflow, `<video>` embed practices |
| [assets/README.md](./assets/README.md) | Sample audio with rough tags for hero demos + regeneration script |
| [e2e/hero-demo.spec.ts](./e2e/hero-demo.spec.ts) | Playwright flow: upload sample MP3 → edit title/artist → download (with **recordVideo**) |
| [output/README.md](./output/README.md) | Where WebM/MP4 artifacts land (gitignored) |

**Prerequisites for recording**

1. Copy `.env.example` → `.env.local` and set all required variables (same as for `npm run dev`).
2. Install browsers once: `npx playwright install chromium`
3. Start the app in another terminal: `npm run dev` (default [http://127.0.0.1:3000](http://127.0.0.1:3000); if you use another port, set `DEMO_BASE_URL`, e.g. `DEMO_BASE_URL=http://127.0.0.1:3001`).

**Record hero demo (WebM under [output/playwright-results/](output/README.md))**

```bash
npm run demo:record
```

**Record and transcode to H.264 MP4** (requires [ffmpeg](https://ffmpeg.org/); writes `demo/output/hero-demo.mp4`):

```bash
npm run demo:record:mp4
```

**Regenerate sample media** (requires [ffmpeg](https://ffmpeg.org/)):

```bash
npm run demo:assets
```

or:

```bash
./demo/assets/generate-hero-demo-mp3.sh
```

Product and engineering documentation that is not demo-specific remains under [docs/](../docs/).
