import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npx tsx tests/e2e/support/start-api.ts",
      url: "http://localhost:4100/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: "npx next dev -p 3100",
      url: "http://localhost:3100",
      env: { EXPRESS_API_URL: "http://localhost:4100" },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
