import env from "@/lib/env";
import { type Meta, type StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { reset } from "../../mocks/data.mock";
import {
  createStories,
  getStories,
} from "../../mocks/functions/storyFunctions";
import { layoutGetServerSession } from "../app/layoutFunctions.mock";
import RootLayout from "./layout";
import Home from "./page";

const meta: Meta<typeof Home> = {
  component: Home,
  decorators: (Story) => (
    <RootLayout>
      <Story />
    </RootLayout>
  ),
  beforeEach: () => {
    layoutGetServerSession.mockClear();
    layoutGetServerSession.mockImplementation(() => {
      console.log("in home mock implementation");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 100);
      });
    });
  },
};

export default meta;

type Story = StoryObj<typeof Home>;

export const MainTest: Story = {
  args: {},
  loaders: [
    () => {
      reset(123);
      layoutGetServerSession.mockClear();
      layoutGetServerSession.mockImplementation(() => {
        console.log("in home mock implementation");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 100);
        });
      });
    },
  ],
  parameters: {
    msw: {
      handlers: [
        http.get(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, () => {
          return HttpResponse.json({
            stories: getStories(10),
            page_number: 1,
            total_pages: 1,
          });
        }),
      ],
    },
    beforeEach: () => {
      layoutGetServerSession.mockClear();
      layoutGetServerSession.mockImplementation(() => {
        console.log("in home mock implementation");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 100);
        });
      });
    },
  },
};

export const VariableStoryCount: Story = {
  args: {
    numStories: 1,
  },
  loaders: [
    ({ args }) => {
      const argsTyped = args as { numStories: number };
      reset(123);
      createStories(argsTyped.numStories);
    },
  ],
  parameters: {
    ...MainTest.parameters,
    msw: {
      handlers: [
        http.get(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, () => {
          return HttpResponse.json({
            stories: getStories(10, false),
            page_number: 1,
            total_pages: 1,
          });
        }),
      ],
    },
  },
};
