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
      waitForTimeout: 5000
    },
    REST: {
      endpoint: process.env.BACKEND_URL || 'http://localhost:3001'
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'task-manager-e2e-tests',
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  }
}; 