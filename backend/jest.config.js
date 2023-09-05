/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  resetMocks: true,
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts)$": [
      "ts-jest",
      {
        "ts-jest": {
          tsconfig: "tsconfig.json",
        },
      },
    ],
  },
};
