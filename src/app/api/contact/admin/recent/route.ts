import prisma from "@/lib/prisma";
import { type BlockedUser } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { isEditor } from "../../tools";
import { RecentBanGetSchema } from "../schema";

export type GetRecentBanResult = {
  bans: BlockedUser[];
  count: number;
};

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  let parsedRequest;
  try {
    parsedRequest = RecentBanGetSchema.parse(params);
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      { status: 400 },
    );
  }

  const { start_index } = parsedRequest;

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const banList = await prisma.blockedUser.findMany({
      skip: start_index,
      take: 8,
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
