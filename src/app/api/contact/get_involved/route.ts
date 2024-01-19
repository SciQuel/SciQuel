import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "../schema";
import { checkBans, checkSpam } from "../tools";

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
    const ip = req.headers.get("x-forwarded-for");

    if (ip !== null) {
      const isSpam = await checkSpam(false, ip);
      if (isSpam) {
        return NextResponse.json(
          { error: "too many messages from this ip address" },
          { status: 400 },
        );
      } else if (isSpam === undefined) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }
    } else {
      const isSpam = await checkSpam(true, parsedRequest.data.reply_email);
      if (isSpam) {
        return NextResponse.json(
          { error: "too many messages from this ip address" },
          { status: 400 },
        );
      } else if (isSpam === undefined) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

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

    const data: Prisma.ContactMessageCreateInput = {
      name: parsedRequest.data.contact_name,
      email: parsedRequest.data.reply_email,
      message: parsedRequest.data.message,
      senderIp: ip !== null ? ip : "unknown",

      contactType: "GET_INVOLVED",
      status: "UNOPENED",
      createdAt: timestamp,
      lastUpdated: timestamp,
    };

    const feedbackDocument = await prisma.contactMessage.create({
      data: data,
    });

    const bodyText = `New Get Involved Survey Submitted by ${data.name}. \nReply to them at ${data.email} \nMessage: \n${data.message}`;

    const bodyHTML = `<h1 style="color:rgb(2,71,64);">New Get Involved Survey Submitted by ${data.name}</h1>
    <h2 style="color:rgb(2,71,64);">Reply to them at ${data.email}</h2>
    <h2 style="color:rgb(2,71,64);">Message:</h2>
    <p>${data.message}</p>`;

    await mailer.sendMail({
      from: '"SciQuel" <no-reply@sciquel.org>',
      replyTo: '"SciQuel Team" <team@sciquel.org>',
      to: process.env.SCIQUEL_TEAM_EMAIL,
      subject: "Sciquel: One(1) New Get Involved Form Submitted",
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
