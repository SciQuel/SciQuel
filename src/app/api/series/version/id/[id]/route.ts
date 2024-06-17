import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json(
        { error: "User is not an editor" },
        { status: 403 },
      );
    }

    const { id } = params;

    const version = await prisma.seriesVersion.findUnique({
      where: { id: id },
      include: { stories: true },
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json(version);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
