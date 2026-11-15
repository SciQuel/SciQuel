import { type Category, type Story, type StoryTopic } from "@prisma/client";
import { db } from "../data.mock";

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

export interface SpecificStoryCreateData {
  topics?: StoryTopic[];
}
export function createSpecificStories(
  storyData: SpecificStoryCreateData = {},
  numStories = 1,
) {
  if (Object.keys(storyData).length == 0) {
    createStories(numStories);
  } else {
    const author1 = db.contributor.create();
    const author2 = db.contributor.create();

    for (let i = 0; i < numStories; i++) {
      const story = db.story.create({
        ...(storyData.topics
          ? {
              topics: storyData.topics,
            }
          : {}),
      });
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
