import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { type ContactStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { contactPatchSchema } from "../../schema";

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

  const foundFeedback = await prisma.contactMessage.findUnique({
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

  const status = parsedRequest.data.new_status as ContactStatus;
  const currentTime = new Date();

  const updatedFeedback = await prisma.contactMessage.update({
    where: {
      id: id,
    },
    data: {
      lastUpdated: currentTime,
      status: status,
      lastUpdatedUserId: user.id,
    },
  });

  if (parsedRequest.data.send_reply) {
    await mailer.sendMail({
      from: process.env.SCIQUEL_TEAM_EMAIL,
      replyTo: process.env.SCIQUEL_TEAM_EMAIL,
      cc: process.env.SCIQUEL_TEAM_EMAIL,
      to: foundFeedback.email,
      subject: "Re: Your Sciquel Get Involved Submission",
      text: parsedRequest.data.reply_text,
    });
  }

  if (updatedFeedback) {
    return NextResponse.json({ updatedFeedback }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
