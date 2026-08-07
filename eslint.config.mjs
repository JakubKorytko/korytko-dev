import { createRequire } from 'module'

import airbnb from 'eslint-config-flat-airbnb'

const require = createRequire(import.meta.url)
const nextPlugin = require('@next/eslint-plugin-next')

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      '.storybook/**',
      'cypress/**',
      'cypress.config.ts',
      'src/stories/**',
      '**/*.cy.ts',
      '**/*.cy.tsx',
      'next-env.d.ts',
    ],
  },
  // Airbnb-style rules for ESLint 9 (flat), without the legacy eslint-config-airbnb tree
  ...airbnb({ typescript: true, react: true, imports: true }),
  // Next.js core-web-vitals via native flat export (avoids FlatCompat + minimatch ESM clash)
  {
    name: 'next/core-web-vitals',
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    rules: {
      // Match the previous project preference for grouped imports (import-x from flat-airbnb)
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Next / React 19 / TypeScript pragmatism
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
      'import-x/prefer-default-export': 'off',
      'import-x/extensions': 'off',
    },
  },
]

export default eslintConfig
