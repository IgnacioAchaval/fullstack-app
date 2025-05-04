const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/outputs',
  helpers: {
    Playwright: {
      url: 'http://localhost:4173',
      show: false,
      browser: 'chromium',
      waitForTimeout: 5000,
      waitForNavigation: 'networkidle',
      restart: true,
      keepBrowserState: false,
      keepCookies: false,
      trace: true,
    },
    REST: {
      endpoint: 'http://localhost:3001',
      timeout: 10000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
    JSONResponse: {},
  },
  include: {
    I: './steps_file.js',
  },
  name: 'task-manager-e2e',
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
}; 