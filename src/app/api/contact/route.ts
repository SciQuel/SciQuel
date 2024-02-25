import prisma from "@/lib/prisma";
import { type ContactMessage, type ContactStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { contactGetSchema } from "./schema";
import { isEditor } from "./tools";

export type GetContactResult = {
  messages: ContactMessage[];
  total_count: number;
};

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  let parsedRequest;
  try {
    parsedRequest = contactGetSchema.parse(params);
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      { status: 400 },
    );
  }

  const { start_index, end_index, status } = parsedRequest;

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const messageList = await prisma.contactMessage.findMany({
      skip: start_index,
      take: end_index - start_index + 1,
      where: {
        status: {
          equals: status as ContactStatus,
        },
      },
    });

    const messageCount = await prisma.contactMessage.count({
      where: {
        status: {
          equals: status as ContactStatus,
        },
      },
    });

    if (messageList) {
      return NextResponse.json({
        messages: messageList,
        total_count: messageCount,
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
