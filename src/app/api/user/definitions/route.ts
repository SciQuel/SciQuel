import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  deleteUserDefinitionsSchema,
  getUserDefinitionsSchema,
  postUserDefinitionsSchema,
} from "./schema";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    console.log(session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //parse url
    const { searchParams } = new URL(request.url);

    //validate client data zod
    const parsedParams = getUserDefinitionsSchema.safeParse(
      Object.fromEntries(searchParams),
    );
    if (!parsedParams.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // check if user exists
    const { user_email } = parsedParams.data;
    //authorize
    if (session?.user.email !== user_email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: user_email,
      },
      include: {
        UserDefinition: true,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //return data
    return NextResponse.json({ savedDefinitions: user.UserDefinition });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//post, the body takes user_id and definition_id
export async function POST(request: Request) {
  try {
    //check if session exists
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedRequest = postUserDefinitionsSchema.safeParse(
      await request.json(),
    );

    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { user_email, definition_id } = parsedRequest.data;

    if (session?.user.email !== user_email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    //get user
    const user = await prisma.user.findUnique({
      where: {
        email: user_email,
      },
    });

    //check if user exists
    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //insert data
    const res = await prisma.userDefinition.create({
      data: {
        userId: user.id,
        definitionId: definition_id,
      },
    });

    if (res === null) {
      return NextResponse.json(
        { error: "Failed to create db entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(res, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "user_id and definition_id combination already exists" },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
