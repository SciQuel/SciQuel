import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});

export async function POST(req: NextRequest) {
  let result;
  try {
    result = bodySchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
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

    //TODO: retrieve user_id from session/cookie
    const user_id = "647ad6fda9efff3abe83044f";

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
