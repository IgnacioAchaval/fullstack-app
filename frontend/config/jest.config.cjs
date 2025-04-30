const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, '../src/$1'),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: [path.resolve(__dirname, '../src/setupTests.ts')],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: path.resolve(__dirname, './tsconfig.test.json')
    }]
  },
  rootDir: path.resolve(__dirname, '..'),
  testMatch: [
    '**/src/**/__tests__/**/*.test.[jt]s?(x)',
    '**/src/**/*.test.[jt]s?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}; 