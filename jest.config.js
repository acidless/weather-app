const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  moduleNameMapper: {
    "^ioredis$": "<rootDir>/__mocks__/ioredis.ts",
  },
};