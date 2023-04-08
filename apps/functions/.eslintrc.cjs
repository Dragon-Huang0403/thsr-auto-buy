module.exports = {
  root: true,
  extends: ['custom'],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  ignorePatterns: ['build/**', '_isolated_/**'],
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
  },
};
