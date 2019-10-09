module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules', 'dist'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 50, // aspire for 80
      functions: 90, // aspire for 80
      lines: 90, // aspire for 80
      statements: 90, // aspire for 80
    },
  },
};
