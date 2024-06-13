import prisma from "@/lib/prisma";
import { type BlockedUser, type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { isEditor } from "../tools";
import { BanDeleteSchema, BanGetSchema, BanPostSchema } from "./schema";

export type GetBanResult = {
  bans: BlockedUser[];
};

export async function DELETE(req: NextRequest) {
  const parsedRequest = BanDeleteSchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error,
      },
      {
        status: 400,
      },
    );
  }

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = parsedRequest.data;

    const banDocument = await prisma.blockedUser.delete({
      where: {
        id: id,
      },
    });

    if (banDocument) {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const parsedRequest = BanPostSchema.safeParse(await req.json());

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error,
      },
      {
        status: 400,
      },
    );
  }

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const { method, value, reason, should_archive, end_time } =
      parsedRequest.data;
    if (method == "EMAIL") {
      const data: Prisma.BlockedUserCreateInput = {
        email: value,
        reason: reason,
        lastUpdated: now,
        banEndTime: end_time,
      };
      const newDoc = await prisma.blockedUser.create({
        data: data,
      });
      if (newDoc) {
        if (should_archive) {
          const toArchive: Prisma.ContactMessageUpdateManyArgs = {
            where: {
              email: value,
            },
            data: {
              status: "ARCHIVED",
            },
          };
          await prisma.contactMessage.updateMany(toArchive);
        }

        return NextResponse.json({
          id: newDoc.id,
        });
      }
    } else {
      // use ip address?
      const data: Prisma.BlockedUserCreateInput = {
        ip: value,
        reason: reason,
        lastUpdated: now,
        banEndTime: end_time,
      };

      const newDoc = await prisma.blockedUser.create({
        data: data,
      });
      if (newDoc) {
        if (should_archive) {
          const toArchive: Prisma.ContactMessageUpdateManyArgs = {
            where: {
              senderIp: value,
            },
            data: {
              status: "ARCHIVED",
            },
          };
          await prisma.contactMessage.updateMany(toArchive);
        }
        return NextResponse.json({
          id: newDoc.id,
        });
      }
    }

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsedRequest = BanGetSchema.safeParse(params);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error,
      },
      { status: 400 },
    );
  }

  const editorStatus = await isEditor();
  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { category, search_string } = parsedRequest.data;

  let searchArgs: Prisma.BlockedUserFindManyArgs;
  switch (category) {
    case "EMAIL":
      searchArgs = {
        where: {
          email: {
            contains: search_string,
          },
        },
      };
      break;

    case "IP":
      searchArgs = {
        where: {
          ip: {
            contains: search_string,
          },
        },
      };
      break;

    case "REASON":
      searchArgs = {
        where: {
          reason: {
            contains: search_string,
          },
        },
      };
      break;
    default:
      return NextResponse.json(
        { error: "Invalid search category" },
        { status: 400 },
      );
  }

  try {
    const foundBans = await prisma.blockedUser.findMany(searchArgs);
    return NextResponse.json({ bans: foundBans });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
