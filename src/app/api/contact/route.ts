import prisma from "@/lib/prisma";
import {
  type ContactMessage,
  type ContactStatus,
  type Prisma,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { contactGetSchema } from "./schema";
import { isEditor } from "./tools";

export type GetContactResult = {
  messages: ContactMessage[];
  total_count: number;
};

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);

  const parsedRequest = contactGetSchema.safeParse(params);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error ? parsedRequest.error : "Bad Request",
      },
      { status: 400 },
    );
  }

  const { start_index, end_index, status } = parsedRequest.data;

  const startInt = parseInt(start_index);
  const endInt = parseInt(end_index);

  if (isNaN(startInt) || isNaN(endInt) || endInt < startInt) {
    return NextResponse.json(
      { error: "start or end index invalid" },
      { status: 400 },
    );
  }

  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const messageList = await prisma.contactMessage.findMany({
      skip: startInt,
      take: endInt - startInt + 1,
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
