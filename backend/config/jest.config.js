/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/../src/tests/setup.ts'],
  testTimeout: 10000, // 10 second timeout for each test
  verbose: true,
  forceExit: true, // Force Jest to exit after all tests have completed
  detectOpenHandles: true, // Detect and print open handles
  clearMocks: true, // Automatically clear mock calls and instances between every test
  restoreMocks: true, // Automatically restore mock state between every test
}; 