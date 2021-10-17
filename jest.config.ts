export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  verbose: true,
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'jsdom',
  automock: false,
  resetMocks: false,
  setupFiles: ['./setupJest.ts'],
  moduleDirectories: ['node_modules', 'src'],
  coverageThreshold: {
    global: {
      functions: 100,
      statements: 100,
      branches: 100,
      lines: 100,
    },
  },
}
