import { type StoryTopic } from "@prisma/client";
import { type Meta, type StoryObj } from "@storybook/nextjs";
import { DateTime } from "luxon";
import bgImg from "../../../public/assets/images/top_background_img.png";
import ArticleCard from "./ArticleCard";

const meta: Meta<typeof ArticleCard> = {
  component: ArticleCard,
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

const defaultArgs = {
  href: "/",
  topic: "ASTRONOMY" as StoryTopic,
  title:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  subtitle:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  author: "Edward Chen",
  date: DateTime.fromJSDate(new Date(1738516180920)).toLocaleString(
    DateTime.DATE_FULL,
  ),
  thumbnailUrl: bgImg.src,
  // "https://storage.googleapis.com/sciquel-user-profiles/01483b53-2065-4a74-a97a-4a7128fd674d.gif",
  mini: false,
  preferHorizontal: false,
};

export const Vertical: Story = {
  args: { ...defaultArgs },
  decorators: (Story) => {
    return (
      <div className="h-full w-full p-4">
        <Story />
      </div>
    );
  },
};

export const VerticalRow: Story = {
  args: { ...defaultArgs },
  decorators: (Story) => (
    <div
      className={`flex flex-row flex-wrap items-stretch 
     justify-stretch gap-4`}
    >
      <div className={`flex flex-1 items-stretch`}>
        <Story />
      </div>
      <div className={`flex flex-1 items-stretch`}>
        <ArticleCard
          {...defaultArgs}
          title="Short Title"
          subtitle="Short Subtitle"
        />
      </div>
      <div className={`flex flex-1 items-stretch`}>
        <ArticleCard {...defaultArgs} title="Short Title." />
      </div>
    </div>
  ),
};

export const VerticalMobile: Story = {
  ...VerticalRow,
  globals: {
    viewport: {
      value: "iphonex",
      isRotated: false
    }
  },
};

export const PreferHorizontal: Story = {
  args: {
    ...defaultArgs,
    preferHorizontal: true,
  },
};

export const PreferHorizontalColumn: Story = {
  args: {
    ...PreferHorizontal.args,
  },
  decorators: (Story) => (
    <div className="grid auto-rows-fr grid-cols-1 gap-3">
      <Story />
      <ArticleCard
        {...defaultArgs}
        title="Short title."
        subtitle="Short subtitle."
        preferHorizontal={true}
      />
      <ArticleCard
        {...defaultArgs}
        title="Short title."
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        preferHorizontal={true}
      />
      <ArticleCard
        {...defaultArgs}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        subtitle="Short subtitle."
        preferHorizontal={true}
      />
    </div>
  ),
};

export const PreferHorizontalMobile: Story = {
  ...PreferHorizontalColumn,
  globals: {
    viewport: {
      value: "iphonex",
      isRotated: false
    }
  },
};
