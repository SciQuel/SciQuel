import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

//to like a comment
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const userEmail = url.searchParams.get("userEmail");

    if (!commentId || !userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "commentId and userEmail are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    //to check auth session
    const session = await getServerSession();
    if (session?.user.email !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //to check if the user has already liked the comment
    const checkLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: commentId,
          userId: user.id,
        },
      },
    });

    if (checkLike) {
      return new NextResponse(
        JSON.stringify({ error: "You have already liked this comment" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const like = await prisma.commentLike.create({
      data: {
        commentId: commentId,
        userId: user.id,
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

//to unlike a comment
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    const userEmail = url.searchParams.get("userEmail");

    if (!commentId || !userEmail) {
      return new NextResponse(
        JSON.stringify({ error: "commentId and userEmail are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    //to check auth session
    const session = await getServerSession();
    if (session?.user.email !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //to check if the user has liked the comment
    const checkLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: commentId,
          userId: user.id,
        },
      },
    });

    if (!checkLike) {
      return new NextResponse(
        JSON.stringify({ error: "You have not liked this comment" }),
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
          userId: user.id,
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
