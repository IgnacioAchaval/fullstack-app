const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: '*.test.js',
  output: 'outputs',
  helpers: {
    REST: {
      endpoint: process.env.APP_URL ? `${process.env.APP_URL}:${process.env.BACKEND_PORT || 4000}` : 'http://localhost:4000',
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
  name: 'task-manager-integration-tests',
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
  },
}; 