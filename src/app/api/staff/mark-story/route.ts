import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { patchSchema, postSchema } from "./schema";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { description, story_id } = postSchema.parse(await request.json());
    const story = await prisma.story.findFirst({ where: { id: story_id } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    const staffPick = await prisma.staffPick.create({
      data: {
        description,
        storyId: story_id,
      },
    });
    //create for record
    await prisma.staffPickRecord.create({
      data: {
        staffId: user.id,
        storyId: story_id,
        updateType: "CREATE",
        newDescription: description,
      },
    });
    return NextResponse.json({ staff_pick: staffPick }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
