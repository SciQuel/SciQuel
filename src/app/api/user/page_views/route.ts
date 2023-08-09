import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSchema, postSchema } from "./schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { user_id } = parsedParams.data;

  try {
    const result = await prisma.pageView.groupBy({
      by: ["storyId"],
      _count: {
        storyId: true,
      },
      orderBy: {
        _count: {
          storyId: "desc",
        },
      },
      take: 10,
      where: {
        userId: user_id,
      },
    });

    const storyIds = result.map((item) => item.storyId);

    const stories = await prisma.story.findMany({
      where: {
        id: {
          in: storyIds,
        },
      },
    });

    const sortedStories = storyIds.map((id) =>
      stories.find((story) => story.id === id),
    );

    return NextResponse.json(sortedStories);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let result;
  try {
    result = postSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    const { story_id, user_id } = result.data;

    // validate story_id
    const story = await prisma.story.findUnique({
      where: {
        id: story_id,
      },
    });

    if (story === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // validate user_id
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const res = await prisma.pageView.create({
      data: {
        userId: user_id,
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
    // req.json() throws an error
    if (!result) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
