import { StoryTopic } from "@prisma/client";
import { type Meta, type StoryObj } from "@storybook/react/*";
import { http, HttpResponse } from "msw";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { type ComponentProps } from "react";
import { db, reset } from "../../../../../mocks/data.mock";
import {
  createSpecificStories,
  createStories,
  getStories,
} from "../../../../../mocks/functions/storyFunctions";
import StoryTopicPage from "./page";

const topics = [
  StoryTopic.ASTRONOMY.toLowerCase(),
  StoryTopic.BIOLOGY.toLowerCase(),
  StoryTopic.CHEMICAL_ENGINEERING.toLowerCase(),
  StoryTopic.CHEMISTRY.toLowerCase(),
  StoryTopic.COMPUTER_SCIENCE.toLowerCase(),
  StoryTopic.ELECTRICAL_ENGINEERING.toLowerCase(),
  StoryTopic.ENVIRONMENTAL_SCIENCE.toLowerCase(),
  StoryTopic.GEOLOGY.toLowerCase(),
  StoryTopic.MATHEMATICS.toLowerCase(),
  StoryTopic.MECHANICAL_ENGINEERING.toLowerCase(),
  StoryTopic.MEDICINE.toLowerCase(),
  StoryTopic.PHYSICS.toLowerCase(),
  StoryTopic.PSYCHOLOGY.toLowerCase(),
  StoryTopic.SOCIOLOGY.toLowerCase(),
  StoryTopic.TECHNOLOGY.toLowerCase(),
] as const;

type PagePropsAndCustomArgs = ComponentProps<typeof StoryTopicPage> & {
  numStories: number;
};

const meta: Meta<PagePropsAndCustomArgs> = {
  component: StoryTopicPage,
  argTypes: {},
};

export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const MainStory: Story = {
  args: {
    numStories: 10,
    params: {
      topic: topics[1],
    },
  },

  loaders: [
    ({ args }) => {
      reset(123);
      console.log("topic exists?: ", topics.includes(args.params.topic));
      console.log(args.numStories);
      if (topics.includes(args.params.topic)) {
        createSpecificStories(
          { topics: [args.params.topic.toUpperCase() as StoryTopic] },
          args.numStories,
        );
      }
      console.log("story count: ", db.story.count());
    },
  ],
};
