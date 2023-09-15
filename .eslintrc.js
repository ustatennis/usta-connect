module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: ['prettier'],
  globals: {
    AWS: 'readonly',
    gapi: 'readonly',
  },
  rules: {
    // allow reassigning param
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': 0,
    'import/extensions': [
      'error',
      {
        js: 'always',
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'ignore', ':': 'ignore' } },
    ],
    'no-bitwise': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
  },
};
