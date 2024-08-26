/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { createCommentSchema } from "./schema";

//to create a comment
export async function POST(req: NextRequest) {
  try {
    // console.log("Received request:", req);
    const requestBody = await req.json();
    // console.log("Request body:", requestBody);

    const parsed = createCommentSchema.safeParse(requestBody);
    // console.log("Validation result:", parsed);

    if (!parsed.success) {
      // console.error("Validation error:", parsed.error);
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const commentData = parsed.data;

    //to check auth session
    const session = await getServerSession();
    if (session?.user.email !== commentData.userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: commentData.userEmail },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const createdComment = await prisma.comment.create({
      data: {
        content: commentData.content,
        quote: commentData.quote,
        parentCommentId: commentData.parentCommentId,
        userId: user.id,
        storyId: commentData.storyId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Comment created successfully",
        commentData: createdComment,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

//to fetch comments by storyId or userEmail
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const storyId = url.searchParams.get("storyId");
    const userEmail = url.searchParams.get("userEmail");

    if (!storyId && !userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "storyId or userEmail is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // const session = await getServerSession();
    // if (session?.user.email !== userEmail) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    if (storyId) {
      const comments = await prisma.comment.findMany({
        where: { storyId: storyId },
        include: {
          replies: true, // Including nested replies in the response
        },
      });

      return new NextResponse(JSON.stringify({ comments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (userEmail) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (user === null) {
        return NextResponse.json(
          { error: "User email doesn't exist" },
          { status: 403 },
        );
      }
      const comments = await prisma.comment.findMany({
        where: { userId: user.id },
        include: {
          replies: true,
        },
      });
      return new NextResponse(JSON.stringify({ comments }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
