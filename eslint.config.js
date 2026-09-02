const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/*", "scripts/*"] },
  {
    rules: {
      "import/no-named-as-default-member": "off",
    },
  },
  {
    files: ["jest.setup.js"],
    languageOptions: {
      globals: { jest: "readonly", require: "readonly" },
    },
  },
]);
