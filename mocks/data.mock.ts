import { faker } from "@faker-js/faker";
import { drop, factory, oneOf } from "@mswjs/data";
import { ContributorModel } from "./models/contributors";
import { StoryModel } from "./models/story";
import { StoryContributionModel } from "./models/storyContributions";

export const db = factory({
  story: { ...StoryModel },
  contributor: {
    ...ContributorModel,
  },
  storyContribution: {
    ...StoryContributionModel,
    story: oneOf("story"),
    contributor: oneOf("contributor"),
  },
});

/** Reset the database */
export const reset = (seed?: number) => {
  faker.seed(seed ?? 123);
  return drop(db);
};
