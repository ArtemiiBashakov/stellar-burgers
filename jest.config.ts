import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  // Используем ts-jest для трансформации TypeScript
  preset: 'ts-jest',

  // Среда выполнения — node (для тестирования функций и редьюсеров)
  testEnvironment: 'node',

  // Добавляем coverage отчёты
  collectCoverage: true,
  coverageProvider: 'v8',

  // Указываем, где лежат тесты
  roots: ['<rootDir>/src'],

  // Расширения файлов, которые будет обрабатывать Jest
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Настройки трансформации
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки ts-jest
        tsconfig: 'tsconfig.json'
      }
    ]
  },

  // Игнорируем node_modules
  transformIgnorePatterns: ['/node_modules/'],

  // Папка с отчётами о покрытии
  coverageDirectory: 'coverage',

  // Пути для алиасов (чтобы Jest понимал @components, @api и т.д.)
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors',
    // Для CSS модулей
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy'
  }
};

export default config;
