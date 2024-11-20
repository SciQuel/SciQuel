import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

interface Params {
  id: unknown;
}

//to get all the version numbers of the story
async function POST(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;

    if (typeof id !== "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    const url = new URL(request.url);
    const version = url.searchParams.get("version");

    const previousVersion = await prisma.storyHistory.findFirst({
      where: {
        storyId: id,
        version: Number(version),
      },
      include: {
        subtopics: true,
        generalSubjects: true,
        storyContributions: true,
        storyContent: true,
        quizzes: true,
      },
    });

    if (!previousVersion) {
      throw new Error("Version not found");
    }

    // to rollback to the previous version of the story
    const [updatedStory] = await prisma.$transaction([
      prisma.story.update({
        where: { id: id },
        data: {
          storyType: previousVersion.storyType,
          category: previousVersion.category,
          title: previousVersion.title,
          titleColor: previousVersion.titleColor,
          slug: previousVersion.slug,
          summary: previousVersion.summary,
          summaryColor: previousVersion.summaryColor,
          topics: previousVersion.topics,
          // subtopics: previousVersion.subtopics,
          // generalSubjects: previousVersion.generalSubjects,
          published: previousVersion.published,
          createdAt: previousVersion.createdAt,
          publishedAt: previousVersion.publishedAt,
          updatedAt: new Date(),
          staffPick: previousVersion.staffPick,
          thumbnailUrl: previousVersion.thumbnailUrl,
          coverCaption: previousVersion.coverCaption,
          // quizzes: previousVersion.quizzes,
          // storyContributions: previousVersion.storyContributions,
          // storyContent: previousVersion.storyContent,
          currentVersion: Number(version),
        },
      }),
    ]);

    prisma.quiz.deleteMany({ where: { id } }),
      prisma.subtopic.deleteMany({ where: { id } }),
      prisma.generalSubject.deleteMany({ where: { id } }),
      prisma.storyContribution.deleteMany({ where: { id } }),
      prisma.storyContent.deleteMany({ where: { id } }),
      prisma.subtopic.createMany({
        data: previousVersion.subtopics.map((sub) => ({
          ...sub,
          id,
        })),
      }),
      prisma.generalSubject.createMany({
        data: previousVersion.generalSubjects.map((sub) => ({
          ...sub,
          id,
        })),
      }),
      prisma.storyContribution.createMany({
        data: previousVersion.storyContributions.map((contrib) => ({
          ...contrib,
          id,
        })),
      }),
      prisma.storyContent.createMany({
        data: previousVersion.storyContent.map((content) => ({
          ...content,
          id,
        })),
      });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Unknown server error",
    };
  }
}

async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;

    if (typeof id !== "string") {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const versions = await prisma.storyHistory.findMany({
      where: {
        storyId: id,
      },
    });

    return NextResponse.json(versions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch story versions" },
      { status: 404 },
    );
  }
}
