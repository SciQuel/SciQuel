import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { ContributorCreateSchema } from "./schema";

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user.email) {
    return NextResponse.json(
      { error: "User must be authorized" },
      { status: 401 },
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  const json = await request.json();
  const parsed = ContributorCreateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { contributorSlug, firstName, lastName, email, bio } = parsed.data;

  try {
    const existingContributor = await prisma.contributor.findFirst({
      where: {
        OR: [
          {
            contributorSlug: contributorSlug,
          },
          {
            email: email,
          },
        ],
      },
    });

    if (existingContributor) {
      return NextResponse.json(
        {
          error: "Unique data overlaps with existing contributor(s)",
          contributor: existingContributor,
        },
        { status: 400 },
      );
    }

    const newContributor = await prisma.contributor.create({
      data: {
        contributorSlug: contributorSlug,
        firstName: firstName,
        lastName: lastName,
        email: email,
        bio: bio,
      },
    });

    return NextResponse.json({ contributor: newContributor }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
