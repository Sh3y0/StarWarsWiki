const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '.expo/**', 'expo-env.d.ts'],
  },
  {
    rules: {
      // `import styled from 'styled-components/native'` is the library's documented usage.
      'import/no-named-as-default': 'off',
    },
  },
];
