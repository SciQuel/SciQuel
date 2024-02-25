import mailer from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { DateTime } from "luxon";
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
      replyTo: process.env.SCIQUEL_EDITORS_EMAIL,
      to: process.env.SCIQUEL_EDITORS_EMAIL,
      subject: "Sciquel: One(1) New Feedback Form Submitted",
      text: bodyText,
      html: bodyHTML,
    });

    const userBodyText = `Thanks for contacting us at SciQuel! \n We're really thankful you took the time to share your thoughts with us, and will review your message soon. If needed, we'll reach out. Have a great day! \n Your message: \n ${
      data.message
    } \n received ${DateTime.fromJSDate(timestamp).toLocaleString(
      DateTime.DATETIME_FULL,
    )}`;
    const userBodyHtml = `<h1 style="color:rgb(2,71,64);">Thanks for contacting us at SciQuel!</h1>
    <p>We're really thankful you took the time to share your thoughts with us, and will review your message soon. If needed, we'll reach out. Have a great day!</p>
    <h2>Your Message:</h2>
    <p>${data.message}</p>
    <p>received ${DateTime.fromJSDate(timestamp).toLocaleString(
      DateTime.DATETIME_FULL,
    )}</p>`;

    await mailer.sendMail({
      from: '"SciQuel" <no-reply@sciquel.org>',
      replyTo: '"SciQuel Team" <team@sciquel.org>',
      to: data.email,
      subject: "Your SciQuel feedback form submission",
      text: userBodyText,
      html: userBodyHtml,
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
