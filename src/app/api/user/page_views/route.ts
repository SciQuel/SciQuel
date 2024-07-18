import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { getSchema, postSchema } from "./schema";

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
    const result = await prisma.pageView.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        storyId: true,
        createdAt: true,
      },
      skip: page * limit,
      take: limit,
      distinct: distinct ? ["storyId"] : undefined,
      where: {
        userId: user.id,
      },
    });
    const countPageViews = await prisma.pageView.count({
      where: {
        userId: user.id,
      },
      distinct: distinct ? ["storyId"] : undefined,
    });
    return NextResponse.json({
      total: countPageViews,
      stories_history: result.map(({ storyId, createdAt }) => ({
        story_id: storyId,
        read_date: createdAt,
      })),
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    console.log(e);

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    //get user if exist
    let user = null;
    const session = await getServerSession();
    if (session) {
      user = await prisma.user.findUnique({
        where: { email: session?.user.email ?? "noemail" },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    const result = postSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const { story_id } = result.data;

    // validate story_id
    const story = await prisma.story.findUnique({
      where: {
        id: story_id,
      },
    });

    if (story === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    const res = await prisma.pageView.create({
      data: {
        userId: user?.id,
        storyId: story_id,
      },
    });

    if (res === null) {
      return NextResponse.json(
        { error: "Failed to create db entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
