process.env.TZ = 'GMT'

module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/setupFilesAfterEnv/index.ts'],

  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['<rootDir>[/\\\\](cypress|test)[/\\\\]'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next|cypress|test)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
}
