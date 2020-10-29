module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  testMatch: ["**/?(*.)+(test).+(ts)"],
  preset: "ts-jest",
  collectCoverageFrom: ["**/src/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "<rootDir>/src/index.ts"],
};
