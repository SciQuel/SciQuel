import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  story_id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { story_id } = params;
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const record = await prisma.staffPickRecord.findMany({
      where: { storyId: story_id },
    });
    return NextResponse.json({ record }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
