import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist', 'playwright-report', 'test-results']),
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js', 'playwright.config.js', 'vite.config.js', 'eslint.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node, ...globals.browser } },
  },
]);
