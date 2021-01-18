module.exports = {
  "parserOptions": {
      "parser": "babel-eslint",
      "ecmaVersion": 2017,
      "sourceType": "module"
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'vue/require-default-prop': false,
    'vue/no-v-html': false,
    semi: ["error", "never"],
    'indent': ["error", 2],
    'no-multiple-empty-lines': ["error", { "max": 1, "maxEOF": 1 }],
    "comma-dangle": ["error", "never"],
    "no-console": ["warn"],
    "object-curly-spacing": ["error", "always"],
    "space-infix-ops": ["error", {"int32Hint": false}],
    "key-spacing": ["error", { "mode": "strict" }]
  }
}
