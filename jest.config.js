/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1", // Maps '@' to your src directory
  },
  testEnvironment: "node",
};
