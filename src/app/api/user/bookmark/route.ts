import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { requestSchema } from "./schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = requestSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { story_id, user_email } = parsedParams.data;

  try {
    const session = await getServerSession();
    if (session?.user.email !== user_email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (user === null) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        storyId: story_id,
        userId: user.id,
      },
    });

    if (bookmark === null) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(bookmark);
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
    result = requestSchema.safeParse(await req.json());
    console.log(result);
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    const { story_id, user_email } = result.data;

    const session = await getServerSession();
    if (session?.user.email !== user_email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
        email: user_email,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const res = await prisma.bookmark.create({
      data: {
        userId: user.id,
        storyId: story_id,
      },
    });

    if (res === null) {
      return NextResponse.json(
        { error: "Failed to create db entry" },
        { status: 500 },
      );
    }
    console.log(res);

    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    // req.json() throws an error
    if (!result) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // user try to create duplicate entries
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "story_id and user_id combination already exists" },
          { status: 400 },
        );
      }
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params = {
      story_id: searchParams.get("story_id"),
      user_email: searchParams.get("user_email"),
    };

    const result = requestSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    const { story_id, user_email } = result.data;

    const session = await getServerSession();
    if (session?.user.email !== user_email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
        email: user_email,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const res = await prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
        storyId: story_id,
      },
    });

    if (res === null) {
      return NextResponse.json(
        { error: "Failed to delete from db" },
        { status: 500 },
      );
    }

    if (res.count === 0) {
      return NextResponse.json({ error: "No entries found" }, { status: 404 });
    }

    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
