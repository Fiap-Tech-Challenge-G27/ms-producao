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
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: "/home/matheus/Documents/pessoal/FIAP/ms-producao/"}),
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: ["**/*.(t|j)s"],
    coverageDirectory: "./coverage",
  };
};
