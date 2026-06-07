import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Feature-Sliced Design: enforce layer import direction.
  // app → pages → widgets → features → entities → shared (downward only).
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'app' },
              allow: {
                to: {
                  type: [
                    'app',
                    'pages',
                    'widgets',
                    'features',
                    'entities',
                    'shared',
                  ],
                },
              },
            },
            {
              from: { type: 'pages' },
              allow: {
                to: {
                  type: ['pages', 'widgets', 'features', 'entities', 'shared'],
                },
              },
            },
            {
              from: { type: 'widgets' },
              allow: {
                to: { type: ['widgets', 'features', 'entities', 'shared'] },
              },
            },
            {
              from: { type: 'features' },
              allow: { to: { type: ['features', 'entities', 'shared'] } },
            },
            {
              from: { type: 'entities' },
              allow: { to: { type: ['entities', 'shared'] } },
            },
            { from: { type: 'shared' }, allow: { to: { type: ['shared'] } } },
          ],
        },
      ],
    },
  },
  // shadcn/ui files export style variants alongside their components.
  {
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  prettier,
])
