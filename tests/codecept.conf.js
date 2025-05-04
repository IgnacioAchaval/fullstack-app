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
      url: 'http://localhost:4173',
      show: false,
      browser: 'chromium',
      waitForTimeout: 5000
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'task-manager-e2e'
}; 