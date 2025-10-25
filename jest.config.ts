import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.stories.{ts,tsx}',
    '!<rootDir>/src/**/index.{ts,tsx}',
    '!<rootDir>/src/**/*.d.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/config/jest/styleMock.ts',
    '\\.(jpg|jpeg|png|gif|svg|webp|bmp)$': '<rootDir>/config/jest/fileMock.ts',
    '\\.(woff|woff2|eot|ttf|otf)$': '<rootDir>/config/jest/fileMock.ts',
    '^@pages$': '<rootDir>/src/pages',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components$': '<rootDir>/src/components',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@utils-types/(.*)$': '<rootDir>/src/utils/types/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.(spec|test).{ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: true,
        useESM: false
      }
    ]
  }
};

export default config;
