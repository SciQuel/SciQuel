import { type Meta, type StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";
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

const renderDropdown = () => (
  <StoryDropdown>
    <p className="m-0 font-medium">How this study was done</p>
    <p className="m-0">
      Researchers compared two groups over twelve weeks and measured changes in
      outcome scores.
    </p>
  </StoryDropdown>
);

export const Closed: Story = {
  render: renderDropdown,
};

export const Open: Story = {
  render: renderDropdown,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByText(/Researchers compared two groups/),
    ).toBeVisible();
  },
};
