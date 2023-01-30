module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true
  },
  globals: {
    chrome: true,
    browser: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'off'
  }
}
