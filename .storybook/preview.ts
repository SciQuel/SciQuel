import type { Preview } from "@storybook/nextjs";
import { initialize, mswLoader } from "msw-storybook-addon";
import { StoriesMock } from "../src/app/api/stories/mock";
import "../src/app/globals.css";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    msw: {
      handlers: [StoriesMock],
    },

    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
