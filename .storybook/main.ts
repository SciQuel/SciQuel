import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "msw-storybook-addon",
    "@storybook/addon-docs"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["..\\public"],
  features: {
    experimentalRSC: true,
  },
  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
    });

    const configRules = config.module?.rules ?? [];

    const svgFileRules = configRules.filter((rule) => {
      if (typeof rule == "object") {
        return (rule as { test: RegExp }).test?.test(".svg");
      } else {
        return false;
      }
    });

    svgFileRules.forEach((rule) => {
      (rule as { exclude: RegExp }).exclude = /\.svg$/i;
      configRules.push({
        ...(rule as {}),
        exclude: undefined,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      });
    });

    configRules.push({
      test: /\.svg$/i,
      resourceQuery: { not: /url/ }, // exclude if *.svg?url
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
                      // viewBox is required to resize SVGs with CSS.
                      // @see https://github.com/svg/svgo/issues/1128
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

    if (config.module) {
      config.module.rules = configRules;
    }

    return config;
  },
};
export default config;
