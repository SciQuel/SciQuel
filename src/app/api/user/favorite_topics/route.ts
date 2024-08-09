import prisma from "@/lib/prisma";
import { type StoryTopic } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  deleteFavoriteTopicSchema,
  getFavoriteTopicsSchema,
  postFavoriteTopicSchema,
} from "./schema";

export async function GET(request: Request) {
  try {
    const parsedRequest = getFavoriteTopicsSchema.safeParse(
      await request.json(),
    );
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { user_id } = parsedRequest.data;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { favorite_topics: user.favoriteTopics },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsedRequest = postFavoriteTopicSchema.safeParse(
      await request.json(),
    );
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { user_id, topic } = parsedRequest.data;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favoriteTopics = user.favoriteTopics;

    if (favoriteTopics.includes(topic)) {
      return NextResponse.json(
        { favoriteTopics: favoriteTopics },
        { status: 200 },
      );
    }

    favoriteTopics.push(topic);

    const result = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        favoriteTopics: favoriteTopics,
      },
    });

    if (result === null) {
      return NextResponse.json(
        { error: "Failed to create db entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { favoriteTopics: favoriteTopics },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const parsedRequest = deleteFavoriteTopicSchema.safeParse(
      await request.json(),
    );
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { user_id, topic } = parsedRequest.data;

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favoriteTopics = user.favoriteTopics.filter(
      (t: StoryTopic) => t !== topic,
    );

    const result = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        favoriteTopics: favoriteTopics,
      },
    });

    if (result === null) {
      return NextResponse.json(
        { error: "Failed to delete db entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { favorite_topics: favoriteTopics },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
