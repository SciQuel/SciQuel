import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  user_email: z.string({
    required_error: "user_email is required",
  }),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = requestSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }
  const user_email = parsedParams.data.user_email;
  try {
    const subscription = await prisma.newsletterSubscription.findFirst({
      where: { email: user_email },
    });

    if (subscription) {
      return NextResponse.json(subscription);
    } else {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 400 },
      );
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.log(error.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let result;
  try {
    result = requestSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }
    const user_email = result.data.user_email;
    const exist = await prisma.newsletterSubscription.findFirst({
      where: { email: user_email },
    });
    if (exist) {
      return NextResponse.json(
        { message: "Email is already subscribed" },
        { status: 400 },
      );
    }
    const newSubscription = await prisma.newsletterSubscription.create({
      data: {
        email: user_email,
      },
    });
    return NextResponse.json(newSubscription, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = requestSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }
  const user_email = parsedParams.data.user_email;
  try {
    await prisma.newsletterSubscription.delete({
      where: { email: user_email },
    });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
