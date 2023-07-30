import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),

  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = requestSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { story_id, user_id } = parsedParams.data;

  try {
    const brain = await prisma.brain.findFirst({
      where: {
        storyId: story_id,
        userId: user_id,
      },
    });

    if (brain === null) {
      return NextResponse.json({ error: "Brain not found" }, { status: 404 });
    }

    return NextResponse.json(brain);

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

    const res = await prisma.brain.create({
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
      user_id: searchParams.get("user_id"),
    };

    const result = requestSchema.safeParse(params);
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

    const res = await prisma.brain.deleteMany({
      where: {
        userId: user_id,
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
