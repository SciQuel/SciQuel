import { type StoryTopic } from "@prisma/client";
import { type Meta, type StoryObj } from "@storybook/nextjs";
import ArticleCard from "./ArticleCard";

const meta: Meta<typeof ArticleCard> = {
  component: ArticleCard,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

const defaultArgs = {
  href: "/",
  topic: "BIOLOGY" as StoryTopic,
  title:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  subtitle:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  author: "Edward Chen",
  date: "January 15, 2025",
  thumbnailUrl: "/assets/images/top_background_img.png",
  mini: false,
  preferHorizontal: false,
};

export const Default: Story = {
  args: { ...defaultArgs },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const PreferHorizontal: Story = {
  args: {
    ...defaultArgs,
    preferHorizontal: true,
  },
};

export const Mini: Story = {
  args: {
    ...defaultArgs,
    mini: true,
  },
};
