import prisma from "@/lib/prisma";
import { Prisma, Story } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  user_email: z.string({
    required_error: "user_email is required",
  }),
  // it is optional to provide page and page_size, if not provided, default values will be used
  page: z.string().optional(),
  page_size: z.string().optional(),
});

export type GetLatestBookmarkRes = {
  days: number;
  id: string;
  createdAt: string;
  story: Story;
  userId: string;
}[];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsedParams = requestSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }
  const { user_email, page, page_size } = parsedParams.data;

  // if page and page_size are provided, convert them to number else use default values
  let pageNum: number, pageSize: number;
  if (page) {
    pageNum = parseInt(page);
  } else {
    pageNum = 1;
  }
  if (page_size) {
    pageSize = parseInt(page_size);
  } else {
    pageSize = 4;
  }

  // const session = await getServerSession();
  // if (session?.user.email !== user_email) {
  //   console.log("session", session);
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: user_email,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find all the bookmarks for the current user in descending order of creation with pagenation
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    if (bookmarks === null) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    // calculate how many days ago the bookmark was created
    const bookmarksWithDaysAgo = bookmarks.map((bookmark) => {
      const days = Math.floor(
        (new Date().getTime() - bookmark.createdAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        ...bookmark,
        days,
        story: bookmark.story,
      };
    });

    return NextResponse.json(bookmarksWithDaysAgo);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e.message);
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    // all other errors
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
