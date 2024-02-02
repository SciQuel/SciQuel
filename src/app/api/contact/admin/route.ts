import { parse } from "path";
import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { BanDeleteSchema, BanGetSchema, BanPostSchema } from "../schema";
import { isEditor } from "../tools";

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
          const alteredDocs = await prisma.contactMessage.updateMany(toArchive);
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
          const alteredDocs = await prisma.contactMessage.updateMany(toArchive);
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
        error: parsedRequest.error ? parsedRequest.error : "Bad Request",
      },
      { status: 400 },
    );
  }

  const editorStatus = await isEditor();
  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { category, search_string } = parsedRequest.data;

  switch (category) {
    case "IP":
      const ipSearchData: Prisma.BlockedUserFindManyArgs = {
        where: {
          ip: {
            equals: search_string,
          },
        },
      };

      const foundUsers = await prisma.blockedUser.findMany(ipSearchData);

      if (foundUsers) {
        return NextResponse.json({
          userList: foundUsers,
        });
      } else {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }
  }
}
