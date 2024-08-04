import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { createCommentSchema } from "../schema";

//to create a reply
export async function POST(req: NextRequest) {
  try {
    const requestBody: unknown = await req.json();
    console.log("Request body:", requestBody);

    const parsed = createCommentSchema.safeParse(requestBody);
    console.log("Validation result:", parsed);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const replyData = parsed.data;

    const createdReply = await prisma.comment.create({
      data: {
        content: replyData.content,
        quote: replyData.quote,
        parentCommentId: replyData.parentCommentId,
        userId: replyData.userId,
        storyId: replyData.storyId,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Reply created successfully",
        commentData: createdReply,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    console.log("Received request:", req.method, req.url);
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error!" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

// to get all replies to comments made by the user(userId)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (userId) {
      const userComments = await prisma.comment.findMany({
        where: { userId: userId },
        select: {
          id: true,
        },
      });

      const userCommentIds = userComments.map((comment) => comment.id);

      const replies = await prisma.comment.findMany({
        where: {
          parentCommentId: {
            in: userCommentIds,
          },
        },
      });

      return new NextResponse(JSON.stringify({ replies }), {
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
