import { expect, test } from "@playwright/test";
import path from "node:path";

const demoMp3 = path.join(
  process.cwd(),
  "demo/assets/audiometa-hero-demo-messy-tags.mp3",
);

test("hero demo: upload, edit tags, download", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(/choose an audio file/i).setInputFiles(demoMp3);
  await expect(
    page.getByRole("heading", { name: /technical information/i }),
  ).toBeVisible({ timeout: 90_000 });
  await expect(page.locator("#writable-tag-title")).toBeEnabled({
    timeout: 90_000,
  });
  await page.locator("#writable-tag-title").fill("Portfolio demo");
  await page.locator("#writable-artist-0").fill("Audiometa");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download with these tags/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename().length).toBeGreaterThan(0);
});
