import { faker } from "@faker-js/faker";
import { primaryKey } from "@mswjs/data";
import testAuthorImg from "../../public/assets/images/author_image.webp";

export const ContributorModel = {
  id: primaryKey(() => faker.database.mongodbObjectId()),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),

  email: () => faker.internet.email(),

  avatarUrl: () => testAuthorImg.src,

  bio: () => faker.lorem.paragraph(),
  contributorSlug: () => faker.lorem.slug(),
};
