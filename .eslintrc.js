module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-absolute-path': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public', // default parameter for all
        overrides: {
          constructors: 'no-public',
          methods: 'explicit', // enforce for methods only
          properties: 'off', // turn off for properties
          parameterProperties: 'off', // turn off for parameter properties
        },
      },
    ],
    'class-methods-use-this': 'off',
    'no-invalid-this': 'error',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules', '*.constants.ts', 'test', '*.config.js'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
