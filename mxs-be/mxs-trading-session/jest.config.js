/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  setupFiles: ["./src/test/env_setup.ts"],
  setupFilesAfterEnv: ["./src/test/setup.ts"],
  verbose: true,
  forceExit: true,
};
