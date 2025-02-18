import env from "@/lib/env";
import { type Meta, type StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { getStories } from "../../mocks/data.mock";
import Home from "./page";

const meta: Meta<typeof Home> = {
  component: Home,
  title: "Home Page",
};

export default meta;

type Story = StoryObj<typeof Home>;

export const MainTest: Story = {
  args: {},
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
};
