import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { createReplySchema } from "../schema";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request:", req);
    const requestBody = await req.json();
    console.log("Request body:", requestBody);

    const parsed = createReplySchema.safeParse(requestBody);
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
        message: "Comment created successfully",
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
