// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  globals: {
    chrome: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['src/globals.d.ts'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'error',
    'no-console': ['error', { allow: ['error'] }],
    semi: ['error', 'never'],
    'comma-dangle': 'off',
    'no-underscore-dangle': [2, { allowAfterThis: true }],
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: false,
        printWidth: 80,
      },
    ],
  },
}
