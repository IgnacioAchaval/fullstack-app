// backend/codecept.conf.js

// ← register TypeScript compiler
require('ts-node/register');

exports.config = {
  // ← still pointing at your .ts tests
  tests: './tests/e2e/*_test.ts',

  output: './tests/output',

  helpers: {
    Playwright: {
      // ← default to port 3000 (your Vite front) unless overridden by CI’s BASE_URL
      url: process.env.BASE_URL || 'http://localhost:3000',
      show: false,
      browser: 'chromium',
    },
  },

  include: {
    I: './steps_file.ts',
  },

  mocha: {},
  name: 'fullstack-app-backend',
};