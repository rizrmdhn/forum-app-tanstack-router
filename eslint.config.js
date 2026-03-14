import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginRouter from '@tanstack/eslint-plugin-router'
import { defineConfig, globalIgnores } from 'eslint/config'
import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default defineConfig([
  globalIgnores(['dist', 'src/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      ...compat.extends('airbnb'),
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // Harus paling terakhir: disable semua formatting rules (Prettier yang handle)
      ...compat.extends('prettier'),
      ...pluginRouter.configs['flat/recommended'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // TypeScript menangani undefined references, tidak butuh ESLint
      'no-undef': 'off',

      // React 17+ tidak perlu import React di setiap file
      'react/react-in-jsx-scope': 'off',
      // Allow .tsx files untuk JSX
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      // Disable prop-types karena pakai TypeScript
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      // Allow both arrow functions and function declarations
      'react/function-component-definition': ['error', {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      }],
      // Prop spreading dibutuhkan oleh shadcn/ui components
      'react/jsx-props-no-spreading': 'off',
      // Named exports lebih diutamakan di project React modern
      'import/prefer-default-export': 'off',
      // Inline arrow functions di JSX valid untuk React modern
      'react/jsx-no-bind': ['warn', {
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
      }],

      // Ganti base rules dengan versi TypeScript-aware
      'no-use-before-define': 'off',
      // Allow function declarations to be used before defined (JS hoisting)
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',

      // Allow _ prefix for unused function params (TypeScript convention)
      'no-underscore-dangle': ['error', { allowFunctionParams: true }],

      // Import: TypeScript handles module resolution
      'import/extensions': ['error', 'ignorePackages', {
        ts: 'never',
        tsx: 'never',
      }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          'src/test/**',
          'vite.config.ts',
          'src/main.tsx',
          'src/routes/__root.tsx',
          'cypress/**',
          'cypress.config.ts',
        ],
      }],

      // Formatting rules: biarkan Prettier yang handle
      'linebreak-style': 'off',
    },
  },

  // Override khusus untuk shadcn/ui generated components
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react/no-unstable-nested-components': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-shadow': 'off',
      'react-refresh/only-export-components': 'off',
      'arrow-body-style': 'off',
      'consistent-return': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/no-array-index-key': 'off',
      'react/no-danger': 'off',
      'eqeqeq': 'off',
      'react/button-has-type': 'off',
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'no-nested-ternary': 'off',
      // Accessibility rules yang tidak relevan untuk UI library components
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
    },
  },

  // Override untuk TanStack Router route files
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'react/no-array-index-key': 'warn',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-nested-ternary': 'off',
    },
  },

  // Override untuk Redux reducers (state param harus pertama, bukan terakhir)
  {
    files: ['src/states/**/reducer.ts'],
    rules: {
      'default-param-last': 'off',
    },
  },
])
