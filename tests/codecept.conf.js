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
      endpoint: process.env.APP_URL ? `http://${process.env.APP_URL}:${process.env.BACKEND_PORT || 4000}` : 'http://localhost:4000',
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
      retries: 3,
    },
  },
}; 