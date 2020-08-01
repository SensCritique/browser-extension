module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true
  },
  globals: {
    chrome: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {}
}
