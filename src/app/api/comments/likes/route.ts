import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const userId = url.searchParams.get("userId");

    if (!commentId || !userId) {
      return new NextResponse(
        JSON.stringify({ error: "commentId and userId are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const like = await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: userId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Comment liked successfully", like }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error liking comment", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const userId = url.searchParams.get("userId");

    if (!commentId || !userId) {
      return new NextResponse(
        JSON.stringify({ error: "commentId and userId are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const deleteLike = await prisma.commentLike.delete({
      where: {
        commentId_userId: {
          commentId: commentId,
          userId: userId,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Comment unliked successfully", deleteLike }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error unliking comment", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
