import prisma from "@/lib/prisma";
import { type BlockedUser } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { RecentBanGetSchema } from "../../schema";
import { isEditor } from "../../tools";

export type GetRecentBanResult = {
  bans: BlockedUser[];
  count: number;
};

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsedRequest = RecentBanGetSchema.safeParse(params);
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error ? parsedRequest.error : "Bad Request",
      },
      { status: 400 },
    );
  }

  const { start_index } = parsedRequest.data;

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const banList = await prisma.blockedUser.findMany({
      skip: start_index,
      take: 10,
      orderBy: {
        lastUpdated: "desc",
      },
    });

    const count = await prisma.blockedUser.count();

    if (banList && typeof count == "number") {
      return NextResponse.json({
        bans: banList,
        count: count,
      });
    } else {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
