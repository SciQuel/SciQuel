import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { genSubCreatePostSchema } from "../schema";

export async function POST(req: NextRequest) {
  const parsed = genSubCreatePostSchema.safeParse(await req.json());

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

    const foundDoc = await prisma.generalSubject.findFirst({
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
    const newDoc = await prisma.generalSubject.create({
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
