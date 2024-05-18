import type { Config } from "@jest/types";
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

// Sync object
const config: Config.InitialOptions = {};

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    moduleFileExtensions: ["js", "json", "ts"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: __dirname}),
    rootDir: ".",
    testRegex: ".*\\.(spec|steps)\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "./coverage",
    reporters: ['default',  ['jest-sonar', {
      outputDirectory: "coverage",
      outputName: "test-reporter.xml"
    }]],
    coveragePathIgnorePatterns: [
      "app.module.ts",
      "main.ts"
    ]
  };
};
