
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
  moduleFileExtensions: [
    "js", "json"
  ],
  testMatch: [
    '<rootDir>/tests/jest/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/*.test.js?(x)',
    '<rootDir>/tests/jest/**/**/**/*.test.js?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/jest/views/modes/related.test.js',
    '<rootDir>/tests/jest/components/InputField.test.js',
    '<rootDir>/tests/jest/components/InputWrapper.test.js',
    '<rootDir>/tests/jest/components/Logger.test.js',
    '<rootDir>/tests/jest/components/Modal.test.js',
    '<rootDir>/tests/jest/components/SearchBar.test.js',
    '<rootDir>/tests/jest/components/SearchInput.test.js',
    '<rootDir>/tests/jest/components/Tag.test.js',
    '<rootDir>/tests/jest/views/modes/logging.test.js',
    '<rootDir>/tests/jest/controller/search.test.js',
    '<rootDir>/tests/jest/util/renderReact.test.js',
    '<rootDir>/tests/jest/util/resource-helper.test.js',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  // globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  setupFiles: [
    '<rootDir>/tests/jest/config/setupTests.js'
  ],
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']
module.exports = jestConfig
