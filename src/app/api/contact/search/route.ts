import prisma from "@/lib/prisma";
import { type ContactMessage, type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { isEditor } from "../tools";
import { getSchema } from "./schema";

export type GetContactSearchResult = {
  messages: ContactMessage[];
};

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsedRequest = getSchema.safeParse(params);

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

  const { search_string, field } = parsedRequest.data;

  try {
    let args: Prisma.ContactMessageFindManyArgs;
    switch (field) {
      case "EMAIL":
        args = {
          where: {
            email: {
              contains: search_string,
            },
          },
        };
        break;

      case "IP":
        args = {
          orderBy: {
            lastUpdated: "desc",
          },
          where: {
            senderIp: {
              contains: search_string,
            },
          },
        };
        break;

      case "MESSAGE":
        args = {
          orderBy: {
            lastUpdated: "desc",
          },
          where: {
            message: {
              contains: search_string,
            },
          },
        };
        break;

      case "NAME":
        args = {
          orderBy: {
            lastUpdated: "desc",
          },
          where: {
            name: {
              contains: search_string,
            },
          },
        };
        break;

      default:
        return NextResponse.json(
          {
            error: "invalid field",
          },
          { status: 400 },
        );
    }

    const foundMessages = await prisma.contactMessage.findMany(args);
    return NextResponse.json({ messages: foundMessages });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
