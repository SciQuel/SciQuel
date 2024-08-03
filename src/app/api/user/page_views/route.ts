import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { getSchema, postSchema } from "./schema";
import { getMarkedStories, isDifferentDateRead } from "./tool";

export async function GET(req: Request) {
  try {
    // check if user is logged in
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const url = new URL(req.url);
    const queryUrl = Object.fromEntries(url.searchParams);
    const parsedResult = getSchema.safeParse({
      page: queryUrl.page ? Number(queryUrl.page) : undefined,
      limit: queryUrl.limit ? Number(queryUrl.limit) : undefined,
      distinct: queryUrl.distinct ? Boolean(queryUrl.distinct) : undefined,
    });
    if (!parsedResult.success) {
      return NextResponse.json(
        {
          error: parsedResult.error.errors[0].message,
          errors: parsedResult.error.errors.map((err) => err.message),
        },
        { status: 404 },
      );
    }
    const { page, limit, distinct } = parsedResult.data;
    const countPageViewAnchor = await prisma.pageView.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        storyId: true,
        createdAt: true,
        story: {
          select: {
            title: true,
            storyContributions: {
              select: {
                contributorId: true,
              },
            },
            thumbnailUrl: true,
          },
        },
      },
      skip: page * limit,
      take: limit,
      distinct: distinct ? ["storyId"] : undefined,
      where: {
        userId: user.id,
        createdAt: {},
      },
    });
    const storyIdSet = new Set<string>();
    countPageViewAnchor.forEach((pageView) => storyIdSet.add(pageView.storyId));
    //get bookmark and brain
    const mapStoryBookmarkedPromise = getMarkedStories(
      user.id,
      Array.from(storyIdSet),
      "BOOK_MARK",
    );
    //get brained
    const mapStoryBrainedPromise = getMarkedStories(
      user.id,
      Array.from(storyIdSet),
      "BRAIN",
    );

    const countPageViewsPromise = prisma.pageView.findMany({
      where: {
        userId: user.id,
      },
      distinct: distinct ? ["storyId"] : undefined,
      select: { id: true },
    });
    const [countPageViews, mapStoryBookmarked, mapStoryBrained] =
      await Promise.all([
        countPageViewsPromise,
        mapStoryBookmarkedPromise,
        mapStoryBrainedPromise,
      ]);
    return NextResponse.json({
      total: countPageViews.length,
      stories_history: countPageViewAnchor.map(
        ({ storyId, createdAt, story }) => ({
          story_id: storyId,
          read_date: createdAt,
          bookmarked: mapStoryBookmarked[storyId] !== undefined,
          brained: mapStoryBrained[storyId] !== undefined,
          cover_image: story.thumbnailUrl,
          contributors: story.storyContributions.map(
            (contributor) => contributor.contributorId,
          ),
        }),
      ),
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    //get user if exist
    let user = null;
    const session = await getServerSession();
    const result = postSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const storyId = result.data.story_id;
    // validate story_id
    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    if (story === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    //get user if session exist
    if (session) {
      user = await prisma.user.findUnique({
        where: { email: session?.user.email ?? "noemail" },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (!(await isDifferentDateRead(storyId, user.id))) {
        return NextResponse.json(
          { error: "Already update user reading history" },
          { status: 403 },
        );
      }
    }

    const res = await prisma.pageView.create({
      data: {
        userId: user?.id,
        storyId: storyId,
      },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
