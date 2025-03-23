import { type StoryTopic, type StoryType } from "@prisma/client";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { type Meta, type StoryObj } from "@storybook/react";
import { DateTime } from "luxon";
import bgImg from "../../../public/assets/images/top_background_img.png";
import MainCard from "./index";

const meta: Meta<typeof MainCard> = {
  component: MainCard,
};

export default meta;

type Story = StoryObj<typeof MainCard>;

const defaultArgs = {
  title:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  subtitle:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  author: "Edward Chen",
  date: DateTime.fromJSDate(new Date(1738516180920)).toLocaleString(
    DateTime.DATE_FULL,
  ),
  thumbnailUrl: bgImg.src,
  mediaType: "ESSAY" as StoryType,
  tag: "BIOLOGY" as StoryTopic,
  href: "/",
};

export const BasicStory: Story = {
  args: defaultArgs,
  decorators: (Story) => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="py-16 md:px-5 lg:px-12">
        <Story />
      </div>
    </div>
  ),
};

export const SmallScreen: Story = {
  ...BasicStory,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphonex",
    },
  },
};
