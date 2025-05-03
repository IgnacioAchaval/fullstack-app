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
      show: false,
      browser: 'chromium',
      headless: true,
      waitForNavigation: 'networkidle',
      waitForAction: 1000,
      waitForTimeout: 5000,
      retryFailedStep: {
        enabled: true,
        retries: 3
      }
    },
    REST: {
      endpoint: process.env.BACKEND_URL || 'http://localhost:3001/api',
      timeout: 10000
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'task-manager-e2e-tests',
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    customLocator: {
      enabled: true
    }
  }
}; 