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
  rootDir: '',
  coveragePathIgnorePatterns: ['node_modules', 'examples'],
  testTimeout: 180000,
  testPathIgnorePatterns: ['__tests__/fixtures', 'build'],
  verbose: true,
  maxConcurrency: 1,
};
