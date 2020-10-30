module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  testMatch: ["**/?(*.)+(test).+(ts)"],
  preset: "ts-jest",
};
