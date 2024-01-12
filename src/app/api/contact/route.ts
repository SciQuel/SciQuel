import prisma from "@/lib/prisma";
import { type Feedback, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { contactGetSchema } from "./schema";

export type GetContactResult = {
  messages: Feedback[];
};

export async function isEditor() {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email ?? "noemail" },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  console.log(req.nextUrl.searchParams);
  const params = Object.fromEntries(req.nextUrl.searchParams);
  console.log(params);

  const parsedRequest = contactGetSchema.safeParse(params);

  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: parsedRequest.error.message
          ? parsedRequest.error.message
          : "Bad Request",
      },
      { status: 400 },
    );
  }

  const {
    include_feedback,
    include_get_involved,

    include_unopened,
    include_needs_response,
    include_closed,

    start_index,
    end_index,
  } = parsedRequest.data;

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

  // build query

  // status?

  const statusTypeList: Prisma.FeedbackWhereInput[] = [];

  if (include_unopened == "true") {
    statusTypeList.push({
      status: {
        equals: "UNOPENED",
      },
    });
  }

  if (include_needs_response == "true") {
    statusTypeList.push({
      status: {
        equals: "NEEDS_RESPONSE",
      },
    });
  }

  if (include_closed == "true") {
    statusTypeList.push({
      status: {
        equals: "CLOSED",
      },
    });
  }

  if (statusTypeList.length < 1) {
    return NextResponse.json(
      { error: "Request must specify at least one status" },
      { status: 400 },
    );
  }

  try {
    const messageList = await prisma.feedback.findMany({
      skip: startInt,
      take: endInt,

      where: {
        OR: statusTypeList,
      },
    });

    if (messageList) {
      return NextResponse.json({ messages: messageList });
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
