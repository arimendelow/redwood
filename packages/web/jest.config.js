/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/*.test.+(ts|tsx|js|jsx)',
    '!**/__typetests__/*.+(ts|tsx|js|jsx)',
  ],
}
