// flat compat
import url from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import isaacscript from "eslint-plugin-isaacscript";
import tseslint from "typescript-eslint";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type { import("eslint").Linter.Config[] } */
export default [
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  ...compat.extends("next"),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      isaacscript,
    },
    rules: {
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],

      "isaacscript/complete-sentences-jsdoc": "warn",
      "isaacscript/format-jsdoc-comments": "warn",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "jsdoc/require-description-complete-sentence": "off",
      "next/no-img-element": "off",
    },
  },
];
