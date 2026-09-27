import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import react from '@eslint-react/eslint-plugin'
import promise from 'eslint-plugin-promise'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  { ignores: ['node_modules/', '.next/', '.vercel/', 'next-env.d.ts'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs['recommended-typescript']
  },
  prettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: { promise },
    rules: {
      'promise/param-names': 'error'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
)
