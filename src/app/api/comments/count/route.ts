import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

//to get
//1. total number of comments made by the user and
//2. total number of unread replies to the user's comments
//3. total number of unread contributor replies to the user's comments
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
    //get total number of comments made by the user
    const totalComments = await prisma.comment.count({
      where: {
        userId: userId,
        // parentCommentId: null,
      },
    });

    //find ids of all the comments made by the user
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
        // read: false,
      },
    });

    //get total number of unread replies to the user's comments
    const totalReplies = await prisma.comment.findMany({
      where: {
        parentCommentId: {
          in: userCommentIds,
        },
      },
    });

    const unreadReplies = totalReplies.filter((reply) => !reply.read);

    const totalUnreadReplies = unreadReplies.length;

    //TODO: get total number of unread contributor replies to the user's comments
    //find users of all the unread replies to the comments made by the user
    const usersWhoseRepliesAreUnread = await prisma.user.findMany({
      where: {
        id: {
          in: unreadReplies.map((reply) => reply.userId),
        },
      },
    });

    const contributorUserId = usersWhoseRepliesAreUnread
      .filter((user) => user.roles.length > 0)
      .map((user) => user.id);

    const contributorReplies = await prisma.comment.findMany({
      where: {
        parentCommentId: {
          in: userCommentIds,
        },
        userId: {
          in: contributorUserId,
        },
      },
    });

    const totalUnreadContributorReplies = contributorReplies.length;

    return new NextResponse(
      JSON.stringify({
        totalComments,
        totalUnreadReplies,
        totalUnreadContributorReplies,
        // replies: replies,
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
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
