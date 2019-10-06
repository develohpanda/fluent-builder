module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./.jest/setupJest.ts'],
    testPathIgnorePatterns: ['node_modules'],
  };