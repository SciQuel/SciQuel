import { type Meta, type StoryObj } from "@storybook/nextjs";
import StoryDropdown from "./StoryDropdown";

const meta: Meta<typeof StoryDropdown> = {
  component: StoryDropdown,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StoryDropdown>;

export const Closed: Story = {
  render: () => (
    <StoryDropdown>
      <p className="m-0 font-medium">How this study was done</p>
      <p className="m-0">
        Researchers compared two groups over twelve weeks and measured changes
        in outcome scores.
      </p>
    </StoryDropdown>
  ),
};
