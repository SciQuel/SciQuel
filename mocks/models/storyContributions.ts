import { faker } from "@faker-js/faker";
import { primaryKey } from "@mswjs/data";
import { ContributionType } from "@prisma/client";

export const StoryContributionModel = {
  id: primaryKey(() => faker.database.mongodbObjectId()),

  contributionType: () => "AUTHOR",
  contributorByline: () => faker.lorem.paragraph(),
  bio: () => faker.lorem.paragraph(),
};
