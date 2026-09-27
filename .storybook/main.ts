import { type StorybookConfig } from "@storybook/nextjs";
import { type RuleSetRule } from "webpack";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (webpackConfig) => {
    const rules = webpackConfig.module?.rules ?? [];
    const fileLoaderRule = rules.find(
      (rule): rule is RuleSetRule =>
        typeof rule === "object" &&
        rule !== null &&
        "test" in rule &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg"),
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
      rules.push({
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      });
    }

    rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: /url/ },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    if (webpackConfig.module) {
      webpackConfig.module.rules = rules;
    }

    return webpackConfig;
  },
};

export default config;
