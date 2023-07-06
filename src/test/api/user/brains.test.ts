import { DELETE, POST } from "@/app/api/user/brains/route";
import prisma from "@/lib/__mocks__/prisma";
import { type NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma");

describe("/api/stories/user/brains API Endpoint", () => {
  const story_id = "647ad74aa9efff3abe83045a";
  const user_id = "647ad6fda9efff3abe83044f";

  beforeEach(() => {
    vi.restoreAllMocks();

    prisma.story.create.mockResolvedValue({
      id: story_id,
      storyType: "ARTICLE",
      title: "Lights. Camera. Action!",
      titleColor: "#ffffff",
      slug: "lights-camera-action",
      summary:
        "How does the Hawaiian bobtail squid singly live with Vibrio fischeri? A look at the Special Relationship between an uncommon bacterium and a pocket-sized squid.",
      summaryColor: "#ffffff",
      tags: ["BIOLOGY"],
      published: true,
      staffPick: false,
      createdAt: new Date("2022-01-11T00:00:00.000Z"),
      publishedAt: new Date("2022-01-11T00:00:00.000Z"),
      updatedAt: new Date("2022-01-11T00:00:00.000Z"),
      thumbnailUrl: "/assets/images/bobtail.png",
    });

    prisma.user.create.mockResolvedValue({
      id: user_id,
      firstName: "John",
      lastName: "Doe",
      email: "email@example.com",
      bio: "bio",
      passwordHash: "password",
      joinedAt: new Date("2022-01-11T00:00:00.000Z"),
    });

    prisma.brain.create.mockResolvedValueOnce({
      id: "647ad74aa9efff3abe83045a",
      userId: user_id,
      storyId: story_id,
      createdAt: new Date("2022-01-11T00:00:00.000Z"),
    });
  });

  it("POST /api/stories/user/brains", async () => {
    const data = {
      story_id: story_id,
      user_id: user_id,
    };
    const req = new Request(
      process.env.NEXT_PUBLIC_SITE_URL + "/api/stories/user/brains",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );

    const res = await POST(req as NextRequest);
    expect(res.status).toBe(200);
  });
});
