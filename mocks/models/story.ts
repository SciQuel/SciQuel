import { faker } from "@faker-js/faker";
import { primaryKey } from "@mswjs/data";
import { StoryTopic, StoryType } from "@prisma/client";
import testimg from "../../public/assets/images/top_background_img.png";

export const StoryModel = {
  id: primaryKey(() => faker.database.mongodbObjectId()),
  storyType: () => faker.helpers.enumValue(StoryType),
  category: () => "ARTICLE",

  title: () => faker.lorem.sentence(),
  titleColor: () => "#ffffff",

  slug: () => faker.lorem.slug(),

  summary: () => faker.lorem.sentences(),
  summaryColor: () => "#ffffff",

  topics: () =>
    faker.helpers.uniqueArray(() => faker.helpers.enumValue(StoryTopic), 2),

  published: () => true,

  thumbnailUrl: () => testimg.src,
  coverCaption: () => faker.lorem.sentence(),

  createdAt: () =>
    faker.date.between({
      from: new Date(1733674011170),
      // december 8 2024
      to: new Date(1733874011170),
      // december 10 2024
    }),
  publishedAt: () =>
    faker.date.between({
      from: new Date(1736573011170),
      // jan 11 2025
      to: new Date(1737573011170),
      // jan 22 2025
    }),
  updatedAt: () =>
    faker.date.between({
      from: new Date(1736573011170),
      // jan 11 2025
      to: new Date(1737573011170),
      // jan 22 2025
    }),
};
