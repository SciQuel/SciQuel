import env from "@/lib/env";
import { http, HttpResponse } from "msw";
import { createStories, db, type TestStory } from "../../../../mocks/data.mock";
import { getStorySchema } from "./schema";

export const StoriesMock = http.get(
  `${env.NEXT_PUBLIC_SITE_URL}/api/stories`,
  ({ request }) => {
    const { searchParams } = new URL(request.url);

    const parsedParams = getStorySchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!parsedParams.success) {
      return HttpResponse.json(parsedParams.error, { status: 400 });
    }

    const {
      page,
      page_size,
      keyword,
      staff_pick,
      topic,
      type,
      date_from,
      date_to,
      sort_by,
      published,
      category,
    } = parsedParams.data;

    const numPagesToSkip = (page && page - 1) || 0;
    const numStoriesPerPage = page_size || 10; // default page size
    date_to?.setDate(date_to.getDate() + 1);

    const total = db.story.count({
      where: {
        ...(keyword ? { title: { contains: keyword } } : {}),
        published: {
          equals: published,
        },
        ...(topic ? { topics: { contains: topic } } : {}),
        storyType: { equals: type },
        category: { equals: category },
        createdAt: {
          gte: date_from,
          lt: date_to,
        },
      },
    });

    const neededTotal = numStoriesPerPage * (numPagesToSkip + 1);

    if (total < neededTotal) {
      createStories(neededTotal - total);
    }

    const storiesRaw = db.story.findMany({
      where: {
        ...(keyword ? { title: { contains: keyword } } : {}),
        published: {
          equals: published,
        },
        ...(topic ? { topics: { contains: topic } } : {}),
        storyType: { equals: type },
        category: { equals: category },
        createdAt: {
          gte: date_from,
          lt: date_to,
        },
      },
      take: numStoriesPerPage,
      skip: numPagesToSkip,
      orderBy: {
        updatedAt: "desc",
        ...(sort_by === "newest" ? { updatedAt: "desc" } : {}),
        ...(sort_by === "oldest" ? { updatedAt: "asc" } : {}),
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
      return next;
    }, [] as TestStory[]);

    return HttpResponse.json({
      stories: storiesMapped,
      page_number: numPagesToSkip + 1,
      total_pages: Math.ceil(Math.max(neededTotal, total) / numStoriesPerPage),
    });
  },
);
