import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { postSchema } from "./schema";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const postParse = postSchema.safeParse(await request.json());
    if (!postParse.success) {
      return NextResponse.json(
        { error: postParse.error.issues[0].message },
        { status: 400 },
      );
    }
    const { description, story_id } = postParse.data;

    const storyPromise = prisma.story.findFirst({ where: { id: story_id } });
    const staffPickCheckPromise = prisma.staffPick.findUnique({
      where: { storyId: story_id },
    });

    const [story, staffPickCheck] = await Promise.all([
      storyPromise,
      staffPickCheckPromise,
    ]);

    if (staffPickCheck) {
      return NextResponse.json(
        { error: "Story has already been Staff-picked" },
        { status: 400 },
      );
    }
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    const staffPickPromise = prisma.staffPick.create({
      data: {
        description,
        storyId: story_id,
      },
    });
    //create for record
    const recordPromise = prisma.staffPickRecord.create({
      data: {
        staffId: user.id,
        storyId: story_id,
        updateType: "CREATE",
        description,
      },
    });
    const [staffPick] = await Promise.all([staffPickPromise, recordPromise]);

    return NextResponse.json({ staff_pick: staffPick }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
