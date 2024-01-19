import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { type ContactStatus, type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { contactGetSchema, contactSchema } from "../schema";
import { checkBans, checkSpam, isEditor } from "../tools";

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
  const ip = req.headers.get("x-forwarded-for");
  const isBanned = await checkBans(
    parsedRequest.data.reply_email,
    ip ? ip : undefined,
  );
  if (isBanned) {
    return NextResponse.json(
      {
        error: "Banned email or IP found",
      },
      { status: 403 },
    );
  }
  if (isBanned === undefined) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  if (ip) {
    const ipSpam = await checkSpam(false, ip);
    if (ipSpam) {
      return NextResponse.json(
        {
          error: "Banned email or IP found",
        },
        { status: 403 },
      );
    }
    if (ipSpam === undefined) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
  const emailSpam = await checkSpam(true, parsedRequest.data.reply_email);
  if (emailSpam) {
    return NextResponse.json(
      {
        error: "Banned email or IP found",
      },
      { status: 403 },
    );
  }

  if (emailSpam === undefined) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  try {
    const timestamp = new Date();

    const data: Prisma.ContactMessageCreateInput = {
      name: parsedRequest.data.contact_name,
      email: parsedRequest.data.reply_email,
      message: parsedRequest.data.message,
      senderIp: ip ? ip : "unknown",

      contactType: "FEEDBACK",
      status: "UNOPENED",
      createdAt: timestamp,
      lastUpdated: timestamp,
    };

    const feedbackDocument = await prisma.contactMessage.create({
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
        AND: [
          {
            status: {
              equals: status as ContactStatus,
            },
          },
          {
            contactType: {
              equals: "FEEDBACK",
            },
          },
        ],
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
