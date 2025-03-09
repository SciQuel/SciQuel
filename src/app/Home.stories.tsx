import env from "@/lib/env";
import { type Meta, type StoryObj } from "@storybook/react";
import RootLayoutBody from "#src/components/layout-components/RootBody/RootBody";
import { http, HttpResponse } from "msw";
import { reset } from "../../mocks/data.mock";
import {
  createStories,
  getStories,
} from "../../mocks/functions/storyFunctions";
import { layoutGetServerSession } from "../app/layoutFunctions.mock";
import Home from "./page";

const meta: Meta<typeof Home> = {
  component: Home,
  decorators: (Story) => (
    <RootLayoutBody>
      <Story />
    </RootLayoutBody>
  ),

  parameters: {
    nextjs: {
      appDirectory: true,
    },
    actions: { argTypesRegex: null },
  },
  beforeEach: () => {
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
};

export default meta;

type Story = StoryObj<typeof Home>;

export const MainTest: Story = {
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
  },
  beforeEach: () => {
    createStories(5);
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

export const VariableStoryCount: Story = {
  args: {
    numStories: 1,
  },
  beforeEach: (story) => {
    reset(123);
    createStories((story.args as { numStories: number }).numStories);
  },
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
