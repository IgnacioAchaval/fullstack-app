export default {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  };