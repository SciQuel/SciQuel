import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { getSchema, postSchema } from "./schema";
import { getReadingHistory } from "./tool";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryUrl = Object.fromEntries(url.searchParams);
    const parsedResult = getSchema.safeParse({
      page: queryUrl.page,
      limit: queryUrl.limit,
      distinct: queryUrl.distinct,
    });
    if (!parsedResult.success) {
      return NextResponse.json(
        {
          error: parsedResult.error.errors[0].message,
          errors: parsedResult.error.errors.map((err) => err.message),
        },
        { status: 400 },
      );
    }
    // check if user is logged in
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { page, limit, distinct } = parsedResult.data;
    const { paginatedResult, countResult, maxPage } = await getReadingHistory({
      userId: user.id,
      limit,
      page,
      distinct,
    });
    return NextResponse.json({
      total: countResult,
      page_number: page + 1,
      total_page: maxPage,
      reading_history: paginatedResult.map((value) => ({
        story_id: value.id,
        last_read: value.lastRead,
        story_summary: value.storySummary,
        story_title: value.storyTitle,
        story_thumbnail_url: value.storyThumbnailUrl,
        story_slug: value.storySlug,
        article_publish: value.articlePublish,
        contributors: value.contributors.map((contributor) => ({
          contributor_id: contributor.id,
          first_name: contributor.firstName,
          last_name: contributor.lastName,
          contributor_type: contributor.type,
        })),
        bookmarked: value.bookmarked,
        brained: value.brained,
      })),
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
    const session = await getServerSession();
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user.email || "noemail",
      },
    });
    const parsedBody = postSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors[0].message },
        { status: 400 },
      );
    }

    const storyId = parsedBody.data.story_id;
    // validate story_id
    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    if (story === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    //create new time everytime user reading story
    await prisma.pageView.create({
      data: {
        userId: user?.id,
        storyId: storyId,
      },
    });
    return NextResponse.json(
      { message: "Updated user reading history" },
      {
        status: 200,
      },
    );
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
