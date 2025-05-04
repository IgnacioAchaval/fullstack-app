const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './integration',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:4173',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    trace: 'on-first-retry',
  },
  reporter: 'list',
  workers: 1,
}); 