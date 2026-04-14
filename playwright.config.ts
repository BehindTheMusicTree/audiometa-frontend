import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.DEMO_BASE_URL?.trim() || "http://127.0.0.1:3001";

export default defineConfig({
  testDir: "demo/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  outputDir: "demo/output/playwright-results",
  timeout: 120_000,
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 720 },
    video: "on",
    trace: "off",
  },
});
