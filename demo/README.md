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
   - For demos, set `NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:8000` in `.env.local`.
2. Install browsers once: `npx playwright install chromium`
3. Start the app in another terminal: `npm run dev`. Playwright defaults to [http://127.0.0.1:3001](http://127.0.0.1:3001) (same as the VS Code launch `PORT`). Stock `next dev` uses port **3000** — then run `DEMO_BASE_URL=http://127.0.0.1:3000 npm run demo:record` (or export it in your shell). `npm run demo:record:mp4` sets `DEMO_BASE_URL` to 3001 when unset.
4. Ensure local backend API is reachable at `http://127.0.0.1:8000/`.

Both `npm run demo:record` and `npm run demo:record:mp4` run a preflight ping (`demo/scripts/check-demo-backend.sh`) and fail early if the API is not reachable.

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
./demo/generate-hero-demo-mp3.sh
```

Product and engineering documentation that is not demo-specific remains under [docs/](../docs/).
