import { type Meta, type StoryObj } from "@storybook/nextjs";
import SideBar from "./SideBar";

const meta: Meta<typeof SideBar> = {
  component: SideBar,
  decorators: [
    (Story) => (
      <div className="min-h-[8rem] bg-sciquelTeal p-4 text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SideBar>;

export const Closed: Story = {};
