exports.config = {
  tests: './tests/*.js',  
  output: './tests/output',
  helpers: {
    Playwright: {
      url: process.env.BASE_URL || 'http://localhost:3000',
      show: false,
      browser: 'chromium'
    }
  },
  name: 'Integration Tests'
};