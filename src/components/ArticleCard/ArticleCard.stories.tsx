import { type Meta, type StoryObj } from "@storybook/react";
import ArticleCard from "./ArticleCard";

const meta: Meta<typeof ArticleCard> = {
  component: ArticleCard,
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

export const Vertical: Story = {
  args: {
    href: "/",
    topic: "ASTRONOMY",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "Edward Chen",
    date: new Date(1738516180920).toISOString(),
    thumbnailUrl:
      "https://storage.googleapis.com/sciquel-user-profiles/01483b53-2065-4a74-a97a-4a7128fd674d.gif",
    mini: false,
    preferHorizontal: false,
  },
  decorators: (Story) => {
    return (
      <div className="h-full w-full p-4">
        <Story />
      </div>
    );
  },
};
