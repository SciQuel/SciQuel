import env from "@/lib/env";
import { type Category } from "@prisma/client";
import { http, HttpResponse } from "msw";
import { db } from "../../../../mocks/data.mock";
import { type TestStory } from "../../../../mocks/functions/storyFunctions";
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
      // staff_pick,
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

    // msw data doesn't allow querying lists easily
    // so topics will have to be filtered later

    console.log(date_to?.toLocaleString());
    console.log("total stories in mock api: ", db.story.count());
    console.log(parsedParams.data);
    console.log(db.story.findMany({}));
    const queryWhere = {
      ...(keyword ? { title: { contains: keyword } } : {}),
      published: {
        equals: published,
      },
      ...(type ? { storyType: { equals: type } } : {}),
      ...(category ? { category: { equals: category } } : {}),
      ...(date_from || date_to
        ? {
            createdAt: {
              ...(date_from ? { gte: date_from } : {}),
              ...(date_to ? { lt: date_to } : {}),
            },
          }
        : {}),
    };
    console.log(queryWhere);
    const storiesRaw = db.story.findMany({
      where: queryWhere,
      orderBy: {
        ...(sort_by === "oldest"
          ? { updatedAt: "asc" }
          : { updatedAt: "desc" }),
      },
      strict: true,
    });

    let finalStorySubset = storiesRaw;

    if (topic) {
      finalStorySubset = finalStorySubset.filter((item) =>
        item.topics.includes(topic),
      );
    }

    const total = finalStorySubset.length;

    const totalToSkip = numPagesToSkip * numStoriesPerPage;

    if (totalToSkip >= total) {
      return HttpResponse.json({
        stories: [],
        page_number: numPagesToSkip + 1,
        total_pages: Math.ceil(total / numStoriesPerPage),
      });
    }

    // cut final story subset into only the section we return?
    finalStorySubset = finalStorySubset.slice(
      totalToSkip,
      Math.min(totalToSkip + numStoriesPerPage, finalStorySubset.length),
    );

    const storiesMapped = finalStorySubset.reduce((accumulator, currItem) => {
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

    return HttpResponse.json({
      stories: storiesMapped,
      page_number: numPagesToSkip + 1,
      total_pages: Math.ceil(total / numStoriesPerPage),
    });
  },
);
