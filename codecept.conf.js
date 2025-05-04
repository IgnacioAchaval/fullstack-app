const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'tests/**/*.test.js',
  output: './outputs',
  helpers: {
    Playwright: {
      url: process.env.APP_URL || 'http://localhost:3000',
      show: true,
      browser: 'chromium',
      waitForTimeout: 5000,
    },
  },
  include: {
    I: './steps_file.js',
  },
  name: 'task-manager',
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFailure: {
      enabled: true,
    },
  },
}; 