import { type Meta, type StoryObj } from "@storybook/react";
import Header from ".";
import { layoutGetServerSession } from "../../app/layoutFunctions.mock";

const meta = {
  component: Header,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  beforeEach: () => {
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
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {};
