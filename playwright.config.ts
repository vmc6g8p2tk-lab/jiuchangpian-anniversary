import { defineConfig } from '@playwright/test'
const port = Number(process.env.PLAYWRIGHT_PORT || 5174)
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, timeout: 30000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://localhost:${port}`, browserName: 'chromium', channel: 'chrome', headless: true, trace: 'retain-on-failure' },
  webServer: { command: `npm run dev -- --port ${port} --strictPort`, url: `http://localhost:${port}`, reuseExistingServer: true },
})
