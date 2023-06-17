import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const storyId = searchParams.get("story_id");

  if (storyId === null) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  // validate storyId
  try {
    const story = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (story === null) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }

  //TODO: retrieve userId from session/cookie
  const userId = "647ad6fda9efff3abe83044f";

  const res = await prisma.pageView.create({
    data: {
      userId: userId,
      storyId: storyId,
    },
  });

  if (res === null) {
    return NextResponse.json(
      { error: "Failed to create db entry" },
      { status: 500 },
    );
  }

  return NextResponse.json(res, { status: 200 });
}
