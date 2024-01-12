import prisma from "@/lib/prisma";
import { Feedback, type FeedbackStatus, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { contactPatchSchema, contactSchema } from "../../schema";

interface Params {
  id: unknown;
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email ?? "noemail" },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsedRequest = contactPatchSchema.safeParse(await req.json());

  const { id } = params;

  if (!parsedRequest.success || typeof id !== "string") {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const foundFeedback = await prisma.feedback.findUnique({
    where: {
      id: id,
    },
  });

  if (!foundFeedback) {
    return NextResponse.json(
      { error: "could not find story with given ID" },
      { status: 400 },
    );
  }

  const status = parsedRequest.data.new_status as FeedbackStatus;
  const currentTime = new Date();

  const updatedFeedback = await prisma.feedback.update({
    where: {
      id: id,
    },
    data: {
      lastUpdated: currentTime,
      status: status,
      lastUpdatedUserId: user.id,
    },
  });

  if (updatedFeedback) {
    return NextResponse.json({ updatedFeedback }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
