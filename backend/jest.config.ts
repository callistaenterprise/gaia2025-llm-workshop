import type {Config} from 'jest';

const config: Config = {
    testMatch: ['<rootDir>/test/*.test.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};

export default config;