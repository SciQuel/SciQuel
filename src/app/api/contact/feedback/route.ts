import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { Feedback, type FeedbackStatus, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { contactPatchSchema, contactSchema } from "../schema";

export async function POST(req: NextRequest) {
  const parsedRequest = contactSchema.safeParse(await req.json());

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

  try {
    const timestamp = new Date();
    const data: Prisma.FeedbackCreateInput = {
      name: parsedRequest.data.contact_name,
      email: parsedRequest.data.reply_email,
      message: parsedRequest.data.message,

      status: "UNOPENED",
      createdAt: timestamp,
      lastUpdated: timestamp,
    };

    const feedbackDocument = await prisma.feedback.create({
      data: data,
    });

    const bodyText = `New Feedback Submitted by ${data.name}. \nReply to them at ${data.email} \nMessage: \n${data.message}`;

    const bodyHTML = `<h1 style="color:rgb(2,71,64);">New Feedback Submitted by ${data.name}</h1>
    <h2 style="color:rgb(2,71,64);">Reply to them at ${data.email}</h2>
    <h2 style="color:rgb(2,71,64);">Message:</h2>
    <p>${data.message}</p>`;

    await mailer.sendMail({
      from: '"SciQuel" <no-reply@sciquel.org>',
      replyTo: '"SciQuel Team" <team@sciquel.org>',
      to: process.env.SCIQUEL_TEAM_EMAIL,
      subject: "Sciquel: One(1) New Feedback Form Submitted",
      text: bodyText,
      html: bodyHTML,
    });

    return NextResponse.json({ id: feedbackDocument.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
