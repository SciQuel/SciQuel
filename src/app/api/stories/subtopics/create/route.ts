import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, Subtopic } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { subtopicCreatePostSchema } from "../schema";

export async function POST(req: NextRequest) {
  const parsed = subtopicCreatePostSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email ?? "noemail",
      },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const foundDoc = await prisma.subtopic.findFirst({
      where: {
        name: {
          equals: parsed.data.name.toLowerCase(),
        },
      },
    });
    if (foundDoc) {
      return NextResponse.json(
        {
          error: "Document Already Exists",
        },
        { status: 400 },
      );
    }
    const newDoc = await prisma.subtopic.create({
      data: {
        name: parsed.data.name.toLowerCase(),
      },
    });

    return NextResponse.json({ document: newDoc }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 400 },
    );
  }
}
