const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
const { effects } = require('codeceptjs/effects');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: '**/*.test.js',
  output: './outputs',
  helpers: {
    REST: {
      endpoint: process.env.APP_URL || 'http://localhost:3000',
      timeout: 30000, // Increased timeout for CI environment
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      onRequest: (request) => {
        console.log(`Making request to: ${request.url}`);
      },
      onResponse: (response) => {
        console.log(`Response status: ${response.status}`);
        if (response.status >= 400) {
          console.log('Response body:', response.data);
        }
      },
    },
    JSONResponse: {},
  },
  include: {
    I: './steps_file.js',
  },
  name: 'task-manager',
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true
    },
    eachElement: {
      enabled: true
    }
  },
  effects: {
    ...effects
  }
}; 