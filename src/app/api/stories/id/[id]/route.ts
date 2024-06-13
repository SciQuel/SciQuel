import prisma from "@/lib/prisma";
import { type ContributionType, type Prisma, type Story } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { patchStorySchema } from "../../schema";

interface Params {
  id: unknown;
}

export type GetStoryResult = Story & {
  storyContributions: {
    contributor: {
      id: string;
      firstName: string;
      lastName: string;
      bio: string;
      avatarUrl: string | null;
    };
    contributionType: ContributionType;
  }[];
  storyContent: {
    content: string;
    footer: string | null;
  }[];
};

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { searchParams } = new URL(req.url);

    const { id } = params;

    if (typeof id !== "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const includeContent = searchParams.get("include_content");

    const result = await prisma.story.findUnique({
      where: {
        id,
      },
      include: {
        storyContributions: {
          select: {
            contributionType: true,
            contributor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
              },
            },
          },
        },
        storyContent:
          includeContent === "true"
            ? {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { content: true, footer: true },
              }
            : false,
      },
    });

    if (result === null) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = patchStorySchema.safeParse(await request.json());

    const { id } = params;

    if (!parsedBody.success || typeof id !== "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    if (parsedBody.data.contributions) {
      await prisma.storyContribution.deleteMany({
        where: {
          storyId: id,
        },
      });

      const storyContributionsPromises: Promise<null | Prisma.StoryContributionCreateManyInput>[] =
        parsedBody.data.contributions.map(async (entry) => {
          const contributor = await prisma.contributor.findUnique({
            where: { email: entry.email },
          });
          if (contributor) {
            return {
              contributorId: contributor.id,
              storyId: id,
              contributionType: entry.contributionType,
              bio: contributor.bio !== entry.bio ? entry.bio : undefined,
            };
          }
          return null;
        });

      const storyContributions = (
        await Promise.all(storyContributionsPromises)
      ).filter((x): x is NonNullable<typeof x> => Boolean(x));

      await prisma.storyContribution.createMany({ data: storyContributions });
    }

    if (parsedBody.data.content || parsedBody.data.footer !== undefined) {
      const storyContent = await prisma.storyContent.findFirst({
        where: { storyId: id },
        orderBy: { createdAt: "desc" },
      });

      if (storyContent) {
        await prisma.storyContent.update({
          where: { id: storyContent.id },
          data: {
            content: parsedBody.data.content,
            footer: parsedBody.data.footer,
          },
        });
      } else {
        await prisma.storyContent.create({
          data: {
            content: parsedBody.data.content ?? "",
            footer: parsedBody.data.footer,
            createdAt: new Date(),
            storyId: id,
          },
        });
      }
    }

    if (parsedBody.data.published !== undefined) {
      await prisma.story.update({
        where: { id },
        data: {
          published: parsedBody.data.published,
        },
      });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
