import prisma from "@/lib/prisma";
import { type GeneralSubject, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { genSubGetSchema } from "../schema";

export interface GenSubSearchResponse {
  docs: GeneralSubject[];
}

export async function GET(req: NextRequest) {
  const objectFromReq = Object.fromEntries(req.nextUrl.searchParams);

  const parsed = genSubGetSchema.safeParse(objectFromReq);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const query: Prisma.GeneralSubjectFindManyArgs = {
    where: {
      name: {
        contains: parsed.data.search_string.toLowerCase(),
      },
    },
    take: 30,
    skip: undefined,
  };

  if (parsed.data.page > 0) {
    query.skip = parsed.data.page * 30;
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

    const docs: GeneralSubject[] = await prisma.generalSubject.findMany(query);

    return NextResponse.json({ docs });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
