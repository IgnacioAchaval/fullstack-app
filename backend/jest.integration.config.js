const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/integration/setup.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
}; 