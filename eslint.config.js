import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next"
// flat compat
import url from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });


export default [
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  ...compat.extends("next")
];
