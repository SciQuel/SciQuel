import { faker } from "@faker-js/faker";
import { drop, factory, oneOf } from "@mswjs/data";
import { ContributionType, type Category, type Story } from "@prisma/client";
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

export function createStories(numStories: number) {
  const author1 = db.contributor.create();
  const author2 = db.contributor.create();
  for (let i = 0; i < numStories; i++) {
    const story = db.story.create();
    db.storyContribution.create({
      story: story,
      contributor: author1,
    });
    if (i % 2 == 0) {
      db.storyContribution.create({
        story: story,
        contributor: author2,
      });
    }
  }
}

interface TestContributor {
  id: string;
  firstName: string;
  lastName: string;

  email: string;

  avatarUrl: string;

  bio: string;
  contributorSlug: string;
}
interface TestStoryContribution {
  id: string;
  contributionType: string;
  contributorByline: string;
  bio: string;
  contributor?: TestContributor;
}
export type TestStory = Story & {
  storyContributions: TestStoryContribution[];
};

export function getStories(numStories: number, createIfNonexistent = true) {
  const storiesCount = db.story.count();
  if (storiesCount < numStories && createIfNonexistent) {
    createStories(numStories - storiesCount);
  }

  const storiesRaw = db.story.findMany({
    take: numStories,
    skip: 0,
    orderBy: {
      publishedAt: "desc",
    },
  });

  const storiesMapped = storiesRaw.reduce((accumulator, currItem) => {
    const next = [...accumulator];
    const contributions = db.storyContribution.findMany({
      where: {
        story: {
          id: {
            equals: currItem.id,
          },
        },
      },
    });

    next.push({
      ...currItem,
      category: currItem.category as Category,
      storyContributions: contributions,
    });

    return next;
  }, [] as TestStory[]);

  return storiesMapped;
}
