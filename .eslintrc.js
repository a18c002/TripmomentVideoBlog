module.exports = {
  'extends': 'plugin:vue/strongly-recommended',
  rules: {
    'vue/html-closing-bracket-newline': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/no-v-html': 'error',
    'vue/prop-name-casing': 'error',
    'vue/html-quotes': 'error',
    'vue/order-in-components': 'error',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/require-default-prop': 'off',
    "vue/script-indent": [
      "error",
      2,
      {
        "switchCase": 1
      }
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: true
  }
}