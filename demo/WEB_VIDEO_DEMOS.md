# Web video demos (efficiency and formats)

Guidance for embedding screen or product demos on the Audiometa site. The goal is smaller transfers, less client work, and better battery use for visitors—not a formal carbon audit. The doc also covers how to **record** demos (human or scripted) and how to **embed** them.

## Table of Contents

- [Default recommendation](#default-recommendation)
- [Format comparison](#format-comparison)
- [Catchy demo capture](#catchy-demo-capture)
- [Programmatic capture](#programmatic-capture)
- [Embedding practices](#embedding-practices)
- [Optional codecs](#optional-codecs)

## Default recommendation

Use **MP4 with H.264** inside a **`<video>`** element for motion demos. It balances **small file size**, **broad support**, and **hardware decoding** on phones and laptops, which usually beats GIF and typical AVI setups for both network and device energy.

## Format comparison

| Format | Role on the web | Efficiency notes |
|--------|-----------------|-------------------|
| **GIF** | Short loops, memes | Poor compression for motion (frame stacks). Often **much larger** than video for the same clip and can be **harder on the CPU** than hardware-decoded H.264. **Avoid for real demos.** |
| **AVI** | Legacy / local | Container, often with codecs that are **not tuned for streaming**. Files tend to be **large**. **Not a first choice** for site embeds. |
| **MP4 (H.264)** | Standard web video | Strong compression, **small files** for the quality, **hardware decode** almost everywhere. **Preferred default** for embedded demos. |
| **WebP (animated)** | GIF alternative | Can beat GIF on size for simple animation. For **longer or smoother motion**, a real **video codec** (H.264, VP9, AV1) usually wins thanks to **temporal** compression between frames. |

**Still images:** Use **WebP** (or AVIF where appropriate) for static screenshots, not for full motion demos.

## Catchy demo capture

Best practices for **recording** demos that feel tight and persuasive on a landing page or docs.

**Story and length**

- **One idea per video** – A single workflow (for example “tag a file and export”) beats a tour of every screen.
- **Front-load the payoff** – In the first **few seconds**, show the end state or the most interesting result, then you can rewind or cut to “here’s how”. Browsers decide quickly whether to keep watching.
- **Keep it short** – Aim for roughly **15–45 seconds** for inline or hero demos; go longer only on a dedicated page where users expect depth.
- **Rehearse once** – Removes dead air, cursor wandering, and “where was that menu again” moments that make viewers drop off.

**Visual clarity**

- **Readable at embed size** – Use browser zoom or a slightly larger window so text and controls stay legible when the player is **narrow** (mobile or sidebar layouts).
- **Cursor and pacing** – Move the pointer **deliberately**; pause briefly on the element you are about to click so the eye can follow.
- **Reduce noise** – Hide unrelated tabs, bookmarks bar, or desktop notifications; use a neutral or on-brand wallpaper if the capture includes the desktop edge.
- **Consistent framing** – Same window size across clips if you ship more than one demo; avoids a jumpy layout next to other content.

**Poster and loop**

- **Poster = best frame** – Pick a **still** that shows the product clearly or the finished outcome. It is your thumbnail in search and social previews too, if the page is shared.
- **Loops** – If you use a short loop (muted autoplay is optional; see [Embedding practices](#embedding-practices)), cut so the **last frame flows** into the first, or end on a calm screen so the jump is not jarring.

**Sound and text**

- **Match audio to context** – Narration helps explanation-heavy flows; **silent + subtle UI** is fine for simple UI demos. Avoid loud or licensed music unless rights are cleared.
- **Captions or short labels** – Helps muted viewing and accessibility; keep on-screen text **large enough** to read when the video is small.

**Polish (without over-producing)**

- A single **title card** (2 seconds) or a **lower-third label** (“Fix missing album art”) can orient viewers; avoid long intros or branding stingers on very short clips.
- Trim **tails** at the end (extra seconds after the success state) to keep file size and watch time down, which aligns with efficient delivery in the sections above.

## Programmatic capture

For **repeatable** demos of the **real app** in a browser (same flow after every release), use **Playwright** plus **ffmpeg**. Both are **free** open-source tools; you only pay indirectly if you run recordings on **paid CI** minutes.

### Recommended stack

| Piece | Role |
|-------|------|
| **Playwright** | Drive the UI (clicks, typing, navigation) and **record video** of the browser context. Fits a **TypeScript / Next.js** repo and can align with existing E2E patterns. See [Playwright: Record video](https://playwright.dev/docs/videos). |
| **ffmpeg** | Transcode Playwright’s recording (often **WebM**) to **H.264 MP4** for the web, trim clips, and extract a **poster** frame. Keeps delivery aligned with [Default recommendation](#default-recommendation). |

**Puppeteer** can record in some setups too; Playwright is the default suggestion here for first-class video recording and API stability.

### Workflow

1. **Script one story** – Implement the same single workflow you would record manually ([Catchy demo capture](#catchy-demo-capture)): one job-to-be-done, deliberate pacing (wait on **selectors** and **navigation**, avoid arbitrary long sleeps unless you need a visible pause for the viewer).
2. **Record** – Enable `recordVideo` on the browser context; run the script against **local** or **staging** URL with test data (no secrets in the recording).
3. **Transcode to MP4** – Use ffmpeg so the site ships **H.264** in an MP4 container (see example below).
4. **Poster** – Grab one high-signal frame (often near the “payoff” moment) for `poster` on `<video>`.

### This repository

- **Playwright** – [playwright.config.ts](../playwright.config.ts) turns on **`video: "on"`**, uses a 1280×720 viewport, and writes artifacts under `demo/output/playwright-results/`.
- **Spec** – [demo/e2e/hero-demo.spec.ts](./e2e/hero-demo.spec.ts) drives the hero flow: upload [demo/assets/audiometa-hero-demo-messy-tags.mp3](./assets/audiometa-hero-demo-messy-tags.mp3), wait for metadata, edit title and artist, then download.
- **Commands** – `npm run demo:record` (WebM only) and `npm run demo:record:mp4` (WebM + **ffmpeg** → `demo/output/hero-demo.mp4`). Prerequisites: `.env.local`, `npm run dev`, `npx playwright install chromium`, and **ffmpeg** on `PATH` for the MP4 script. Optional: `DEMO_BASE_URL` if the dev server is not at `http://127.0.0.1:3000`. Details: [demo/README.md](./README.md).

### ffmpeg examples

Adjust paths and timestamps to your files. These are starting points, not a full encoding policy.

**WebM (from Playwright) → H.264 MP4**, suitable for embedding (YUV 4:2:0, fast start for streaming):

```bash
ffmpeg -i demo.webm -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium -movflags +faststart -an demo.mp4
```

`-an` drops audio; omit it and map audio if you add a narrated track. For **AAC** audio:

```bash
ffmpeg -i demo.webm -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium -movflags +faststart -c:a aac -b:a 128k demo.mp4
```

**Poster frame** (example: seek to 2 seconds, write WebP):

```bash
ffmpeg -ss 2 -i demo.mp4 -frames:v 1 -c:v libwebp -quality 85 poster.webp
```

If `libwebp` is unavailable, use `-frames:v 1 poster.png` and convert to WebP with your usual image tooling.

### When to use something else

- **One-off hero clip with heavy polish** (zooms, callouts, music): often faster to **record manually** with **OBS** or **Kap** and edit, unless you invest heavily in automation.
- **Motion graphics built in code** (not a live app): consider **Remotion**; check **license terms** for commercial shipping on their site.
- **Terminal-only demos**: **asciinema** (and tools like **agg** for GIF/video) are free options.

## Embedding practices

These choices often matter as much as the container format:

- **Prefer user-initiated playback** over autoplay loops: use a **`poster`** image and play on click or tap so visitors who skip the demo do not pay decode or bandwidth costs.
- **Avoid aggressive `preload`**: use `metadata` or omit preload when the video is below the fold.
- **Keep resolution and bitrate modest** for UI demos (for example 720p unless 1080p is clearly needed).
- **Lazy-load** the player when it enters the viewport if your stack supports it.

Example pattern:

```html
<video
  controls
  playsinline
  preload="metadata"
  poster="/images/demo-poster.webp"
  width="1280"
  height="720"
>
  <source src="/videos/demo.mp4" type="video/mp4" />
</video>
```

Adjust paths and attributes to match your hosting and design (e.g. muted loop only when you deliberately want that behavior).

## Optional codecs

- **WebM (VP9)** or **AV1** can reduce file size further at a given quality. **Decode cost** varies by device; AV1 hardware support is still uneven compared to H.264.
- A common pattern is **H.264 MP4 as the primary source** and optional **WebM or AV1** as additional `<source>` entries for browsers that select them.

Encoding one clip in multiple codecs increases build and maintenance effort; add second sources when the bandwidth win is worth it.

## Related docs

- [README.md](./README.md) – demo hub (sample media, scripts)
- [SEO_AND_AEO.md](../docs/SEO_AND_AEO.md) – content and discoverability, including performance as part of experience
