import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";
import { StoriesMock } from "../src/app/api/stories/mock";
import "../src/app/globals.css";

initialize({ onUnhandledRequest: "warn" });

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    msw: {
      handlers: [StoriesMock],
    },
  },
};

export default preview;
