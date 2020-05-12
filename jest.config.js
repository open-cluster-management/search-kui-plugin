
const tapReporter = [
  'jest-tap-reporter',
  {
    logLevel: 'ERROR',
    showInternalStackTraces: true,
    filePath: 'test-output/jestTestLogs.tap'
  }
]

const jestConfig = {
  collectCoverage: true,
  collectCoverageFrom: [
    'dist/**/*.{js,jsx}'
  ],
  coverageDirectory: './test-output/coverage',
  coverageReporters: [
    'json-summary',
    'json',
    'html',
    'lcov',
    'text',
    'text-summary'
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },
  moduleFileExtensions: [
    "js", "json"
  ],
  testMatch: [
    '<rootDir>/tests/jest/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/**/*.test.js?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/jest/views/modes/related.test.js'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  // globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  // setupFiles: [
  //   '<rootDir>/tests/jest/config/setup.js'
  // // ],
  // moduleNameMapper: {
  //   '\\.(css|scss|svg)$': '<rootDir>/tests/jest/config/styleMock.js'
  // }
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']

module.exports = jestConfig
