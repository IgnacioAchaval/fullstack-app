const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/outputs',
  helpers: {
    Playwright: {
      url: process.env.FRONTEND_URL || 'http://localhost:3000',
      show: !process.env.HEADLESS,
      browser: 'chromium',
      waitForNavigation: 'networkidle',
      waitForTimeout: 5000,
      retryFailedStep: {
        enabled: true,
        retries: 2
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'task-manager-e2e-tests',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}; 