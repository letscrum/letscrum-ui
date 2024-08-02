/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    './.eslintrc-auto-import.json',
    'eslint:recommended',
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}
