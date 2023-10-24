module.exports = {
  transform: {
    '.*.ts': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFilesAfterEnv: [],
  collectCoverage: true,
  rootDir: 'test',
  coveragePathIgnorePatterns: ['node_modules'],
  testTimeout: 180000,
  testPathIgnorePatterns: ['__tests__/fixtures', 'build'],
  verbose: true,
  maxConcurrency: 1,
};

// "jest": {
//   "moduleFileExtensions": [
//     "js",
//     "json",
//     "ts"
//   ],
//   "rootDir": "test",
//   "testRegex": ".*\\.test\\.ts$",
//   "transform": {
//     "^.+\\.(t|j)s$": "ts-jest"
//   },
//   "collectCoverageFrom": [
//     "**/*.(t|j)s"
//   ],
//   "coverageDirectory": "../coverage",
//   "testEnvironment": "node"
// }
