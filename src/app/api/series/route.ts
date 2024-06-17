import prisma from "@/lib/prisma";
import { DateTime } from "luxon";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import { getSeriesSchema, postSeriesSchema } from "./schema";

const TEST_USER_ID = "5e8b3c6f4a2d5e8b3c6f4a2d";

export async function GET(request: NextRequest) {
  try {
    let allVersions;
    if (!request.body) {
      allVersions = await prisma.series.findMany({
        include: { versions: true },
        orderBy: { lastUpdatedDate: "desc" },
      });
    } else {
      const parsedRequest = getSeriesSchema.safeParse(await request.json());
      if (!parsedRequest.success) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 });
      }
      const data = parsedRequest.data;
      allVersions = await prisma.series.findMany({
        where: {
          ...(data.createdBy ? { createdBy: data.createdBy } : {}),
          ...(data.publishedByScheduler
            ? { publishedByScheduler: data.publishedByScheduler }
            : {}),
          ...(data.seriesPublishStatus
            ? { seriesPublishStatus: data.seriesPublishStatus }
            : {}),
        },
        include: { versions: true },
        orderBy: { lastUpdatedDate: "desc" },
      });
    }

    const series = allVersions.map((series) => {
      const recentVersion = series.versions.pop();
      if (!recentVersion) {
        return {};
      }
      return {
        id: series.id,
        versionId: recentVersion.id,
        seriesName: recentVersion.seriesName,
        seriesSlug: recentVersion.seriesSlug,
        seriesURL: recentVersion.seriesURL,
        seriesDescription: recentVersion.seriesDescription,
        stories: recentVersion.storyIds,
        createdDate: series.createdDate,
        createdBy: series.createdBy,
        lastUpdatedDate: series.lastUpdatedDate,
        scheduledPublishDate: series.scheduledPublishDate,
        publishedDate: series.publishedDate,
        publishedByScheduler: series.publishedByScheduler,
        seriesPublishStatus: series.seriesPublishStatus,
      };
    });

    return NextResponse.json({ series });
  } catch (e) {
    return NextResponse.json(
      {
        error: `Internal Server Error: ${
          e instanceof Error ? e.message : String(e)
        }`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json(
        { error: "User is not an editor" },
        { status: 403 },
      );
    }

    const parsedRequest = postSeriesSchema.safeParse(await request.json());
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const data = parsedRequest.data;
    const dateTimeUTC = DateTime.utc();
    const dateTimeEST = dateTimeUTC.setZone("America/New_York");
    const formattedDateTime = dateTimeEST.toFormat("yyyy-LL-dd HH:mm:ss");
    const now = dateTimeEST.toJSDate();

    const createdDate = now;
    const lastUpdatedDate = now;
    const createdBy = TEST_USER_ID;
    const scheduledPublishDate =
      data.scheduledPublishDate && data.scheduledPublishDate > now
        ? data.scheduledPublishDate
        : null;
    const publishedDate = scheduledPublishDate ? null : now;
    const publishedByScheduler = false;
    const seriesPublishStatus = publishedDate ? "VISIBLE" : "SCHEDULED";

    const newSeries = await prisma.series.create({
      data: {
        createdDate: createdDate,
        lastUpdatedDate: lastUpdatedDate,
        createdBy: createdBy,
        scheduledPublishDate: scheduledPublishDate,
        publishedDate: publishedDate,
        publishedByScheduler: publishedByScheduler,
        seriesPublishStatus: seriesPublishStatus,
      },
    });

    const versionName = data.versionName ?? formattedDateTime;
    const versionDate = now;
    const versionBy = TEST_USER_ID;
    const versionScheduledPublishDate = scheduledPublishDate;
    const versionPublishDate = publishedDate;
    const versionPublishedByScheduler = publishedByScheduler;
    const versionSeriesStatus = seriesPublishStatus;
    const seriesName = data.seriesName;
    const seriesSlug = data.seriesSlug ?? slug(data.seriesName);
    const seriesURL = publishedDate
      ? `sciquel.org/series/${publishedDate.getFullYear()}/${
          publishedDate.getMonth() + 1
        }/${publishedDate.getDate()}/${seriesSlug}`
      : null;
    const seriesDescription = data.seriesDescription;
    const storyIds = data.storyIds;

    const newVersion = await prisma.seriesVersion.create({
      data: {
        versionName: versionName,
        versionDate: versionDate,
        versionBy: versionBy,
        versionScheduledPublishDate: versionScheduledPublishDate,
        versionPublishDate: versionPublishDate,
        versionPublishedByScheduler: versionPublishedByScheduler,
        versionSeriesStatus: versionSeriesStatus,

        seriesName: seriesName,
        seriesSlug: seriesSlug,
        seriesURL: seriesURL,
        seriesDescription: seriesDescription,
        storyIds: storyIds,

        seriesId: newSeries.id,
      },
    });

    for (const storyId of storyIds) {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
      });

      if (!story) {
        continue;
      }

      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          seriesVersionsIds: [
            ...(story.seriesVersionsIds ?? []),
            newVersion.id,
          ],
        },
      });
    }

    return NextResponse.json({
      series: newSeries,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
