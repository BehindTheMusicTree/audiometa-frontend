import { expect, test } from "@playwright/test";
import path from "node:path";

const demoMp3 = path.join(
  process.cwd(),
  "demo/assets/audiometa-hero-demo-messy-tags.mp3",
);

test("hero demo: upload, edit tags, download", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: /audio metadata manager/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^choose file$/i })).toBeEnabled();

  const chooseFile = page.getByRole("button", { name: /^choose file$/i });
  await chooseFile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.setInputFiles('input[type="file"][accept="audio/*"]', []);
  await page.setInputFiles('input[type="file"][accept="audio/*"]', demoMp3);
  const fileInput = page.locator('input[type="file"][accept="audio/*"]');
  const filesOnInput = await fileInput.evaluate(
    (el: HTMLInputElement) => el.files?.length ?? 0,
  );
  expect(filesOnInput, "Playwright should attach a file to the input").toBe(1);

  await expect(page.getByRole("heading", { name: /^edit tags$/i })).toBeVisible({
    timeout: 90_000,
  });
  await expect(page.locator("#writable-tag-title")).toBeEnabled({
    timeout: 30_000,
  });

  await page.locator("#writable-tag-title").fill("Portfolio demo");
  await page.locator("#writable-artist-0").fill("Audiometa");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download with these tags/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename().length).toBeGreaterThan(0);
});
