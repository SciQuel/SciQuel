import { randomUUID } from "crypto";
import { bucket, bucketUrlPrefix } from "@/lib/gcs";
import prisma from "@/lib/prisma";
import {
  ContributionType,
  Prisma,
  StoryTopic,
  StoryType,
  type Story,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import { type z } from "zod";
import {
  getStorySchema,
  patchStorySchema,
  postStorySchema,
  putStorySchema,
} from "./schema";

export type Stories = (Story & {
  storyContributions: {
    user: {
      firstName: string;
      lastName: string;
    };
    contributionType: ContributionType;
  }[];
})[];

export type GetStoriesResult = {
  stories: Stories;
  page_number: number;
  total_pages: number;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getStorySchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
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
  } = parsedParams.data;

  // Can only retrieve unpublished stories if EDITOR
  if (!published) {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const numPagesToSkip = (page && page - 1) || 0;
  const numStoriesPerPage = page_size || 10; // default page size

  // to include stories created on that date
  date_to?.setDate(date_to.getDate() + 1);

  try {
    const query: Prisma.StoryFindManyArgs = {
      where: {
        ...(keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { summary: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {}),
        staffPick: staff_pick,
        ...(topic ? { tags: { has: topic } } : {}),
        storyType: type,
        createdAt: {
          gte: date_from,
          lt: date_to,
        },
        published,
      },
    };

    const stories = await prisma.story.findMany({
      skip: numPagesToSkip * numStoriesPerPage,
      take: numStoriesPerPage,
      include: {
        storyContributions: {
          select: {
            contributionType: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      where: query.where,
      orderBy: {
        updatedAt: "desc",
        ...(sort_by === "newest" ? { updatedAt: "desc" } : {}),
        ...(sort_by === "oldest" ? { updatedAt: "asc" } : {}),
      },
    });

    const numStories = await prisma.story.count({
      where: query.where,
    });

    return NextResponse.json(
      {
        stories,
        page_number: numPagesToSkip + 1,
        total_pages: Math.ceil(numStories / numStoriesPerPage),
      } ?? { stories: [] },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const timestamp = new Date();
  const parsedBody = postStorySchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const { title, content } = parsedBody.data;

  const user = await prisma.user.findFirst({});
  if (!user) {
    return NextResponse.json({ error: "No user available" }, { status: 500 });
  }

  const storyContribution = await prisma.storyContribution.create({
    data: {
      user: { connect: { id: user.id } },
      story: {
        create: {
          storyType: StoryType.ARTICLE,
          title,
          titleColor: "#ffffff",
          slug: slug(title),
          summary: `summary of ${title}`,
          summaryColor: "#ffffff",
          tags: [StoryTopic.ASTRONOMY],
          published: true,
          staffPick: Math.random() > 0.5,
          thumbnailUrl: "/assets/images/bobtail.png",
          createdAt: timestamp,
          publishedAt: timestamp,
          updatedAt: timestamp,
        },
      },
      contributionType: ContributionType.AUTHOR,
    },
  });

  await prisma.storyContent.create({
    data: {
      story: { connect: { id: storyContribution.storyId } },
      content,
      createdAt: timestamp,
    },
  });

  return NextResponse.json({}, { status: 201 });
}

async function processThumbnailImage(
  data: z.infer<typeof putStorySchema>,
): Promise<string | null> {
  if (data.image) {
    const imageMimeType = data.image.type;
    const extension =
      imageMimeType === "image/jpeg"
        ? "jpg"
        : imageMimeType === "image/png"
        ? "png"
        : "gif";
    const thumbnailFilename = `${randomUUID()}.${extension}`;
    const thumbnailUrl = `${bucketUrlPrefix}${thumbnailFilename}`;
    await bucket
      .file(thumbnailFilename)
      .save(Buffer.from(await data.image.arrayBuffer()));
    return thumbnailUrl;
  }
  return data.imageUrl ?? null;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedRequest = putStorySchema.safeParse(await request.formData());
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const timestamp = new Date();

    const thumbnailUrl = await processThumbnailImage(parsedRequest.data);

    if (thumbnailUrl === null) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    if (parsedRequest.data.id) {
      const story = await prisma.story.findUnique({
        where: { id: parsedRequest.data.id },
      });

      if (!story) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
      }

      if (
        story.thumbnailUrl &&
        story.thumbnailUrl.startsWith(bucketUrlPrefix)
      ) {
        await bucket
          .file(story.thumbnailUrl.slice(bucketUrlPrefix.length))
          .delete({ ignoreNotFound: true });
      }

      await prisma.story.update({
        where: { id: parsedRequest.data.id },
        data: {
          title: parsedRequest.data.title,
          summary: parsedRequest.data.summary,
          thumbnailUrl,
          updatedAt: timestamp,
        },
      });

      return NextResponse.json({ id: parsedRequest.data.id });
    }

    const newStory = await prisma.story.create({
      data: {
        title: parsedRequest.data.title,
        summary: parsedRequest.data.summary,
        storyType: StoryType.ARTICLE,
        titleColor: "#ffffff",
        slug: slug(parsedRequest.data.title),
        summaryColor: "#ffffff",
        createdAt: timestamp,
        publishedAt: timestamp,
        updatedAt: timestamp,
        staffPick: false,
        published: false,
        thumbnailUrl,
      },
    });

    return NextResponse.json({ id: newStory.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = patchStorySchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    await prisma.storyContribution.deleteMany({
      where: {
        storyId: parsedBody.data.id,
      },
    });

    const storyContributionsPromises: Promise<null | Prisma.StoryContributionCreateManyInput>[] =
      parsedBody.data.contributions.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { email: entry.email },
        });
        if (user) {
          return {
            userId: user.id,
            storyId: parsedBody.data.id,
            contributionType: entry.contributionType,
            bio: user.bio !== entry.bio ? entry.bio : undefined,
          };
        }
        return null;
      });

    const storyContributions = (
      await Promise.all(storyContributionsPromises)
    ).filter((x): x is NonNullable<typeof x> => Boolean(x));

    await prisma.storyContribution.createMany({ data: storyContributions });

    return NextResponse.json({ id: parsedBody.data.id }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
