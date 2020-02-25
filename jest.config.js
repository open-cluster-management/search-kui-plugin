
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
  //     lines: 0,
  //     statements: 0,
  //   },
  // },
  testMatch: [
    '<rootDir>/build-tools/tests/jest/**/*.test.js?(x)',
    '<rootDir>/build-tools/tests/jest/**/**/*.test.js?(x)',
    '<rootDir>/build-tools/tests/jest/**/**/**/*.test.js?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/build-tools/tests/jest/views/modes/related.test.js'
  ]
  // globalSetup: '<rootDir>/build-tools/tests/jest/config/properties-to-json.js',
  // setupFiles: [
  //   '<rootDir>/tests/jest/config/setup.js'
  // // ],
  // moduleNameMapper: {
  //   '\\.(css|scss|svg)$': '<rootDir>/tests/jest/config/styleMock.js'
  // }
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']

module.exports = jestConfig
