import { type Meta, type StoryObj } from "@storybook/nextjs";
import Header from ".";

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="[&_header]:!w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};
