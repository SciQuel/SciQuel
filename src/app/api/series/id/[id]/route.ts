import prisma from "@/lib/prisma";
import { DateTime } from "luxon";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import { patchSeriesSchema } from "../../schema";

const TEST_USER_ID = "5e8b3c6f4a2d5e8b3c6f4a2d";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const parsedRequest = patchSeriesSchema.safeParse(await request.json());
  if (!parsedRequest.success) {
    console.error(parsedRequest.error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

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

    const { id } = params;

    const existingSeries = await prisma.series.findUnique({
      where: { id: id },
      include: {
        versions: {
          include: {
            stories: true,
          },
        },
      },
    });

    if (!existingSeries) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    const currentVersion =
      existingSeries.versions[existingSeries.versions.length - 1];

    const data = parsedRequest.data;
    const dateTimeUTC = DateTime.utc();
    const dateTimeEST = dateTimeUTC.setZone("America/New_York");
    const formattedDateTime = dateTimeEST.toFormat("yyyy-LL-dd HH:mm:ss");
    const now = dateTimeEST.toJSDate();

    const scheduledPublishDate =
      data.scheduledPublishDate ?? existingSeries.scheduledPublishDate;
    const publishedDate =
      scheduledPublishDate && scheduledPublishDate > now ? null : now;
    const publishedByScheduler = scheduledPublishDate
      ? false
      : existingSeries.publishedByScheduler;
    const seriesPublishStatus =
      scheduledPublishDate && scheduledPublishDate > now
        ? "SCHEDULED"
        : "VISIBLE";

    await prisma.series.update({
      where: { id: id },
      data: {
        lastUpdatedDate: now,
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
    const seriesName = (data.seriesName as string) ?? currentVersion.seriesName;
    const seriesSlug =
      (data.seriesSlug as string) ??
      (seriesName ? slug(seriesName) : currentVersion.seriesSlug);
    const seriesURL = publishedDate
      ? `sciquel.org/series/${publishedDate.getFullYear()}/${
          publishedDate.getMonth() + 1
        }/${publishedDate.getDate()}/${seriesSlug}`
      : null;
    const seriesDescription =
      (data.seriesDescription as string) ?? currentVersion.seriesDescription;
    const storyIds = (data.storyIds as string[]) ?? currentVersion.storyIds;

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

        seriesId: id,
      },
      include: { stories: true },
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

    await prisma.seriesVersion.update({
      where: { id: currentVersion.id },
      data: {
        versionSeriesStatus: "NOT_VISIBLE",
        seriesURL: null,
      },
    });

    return NextResponse.json({ series: existingSeries });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    const series = await prisma.series.findUnique({
      where: { id: id },
      include: { versions: true },
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const { id } = params;

    const series = await prisma.series.findUnique({
      where: { id: id },
      include: { versions: true },
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    const versionIds = series.versions.map((version) => version.id);
    const storiesToUpdate = await prisma.story.findMany({
      where: {
        seriesVersionsIds: {
          hasSome: versionIds,
        },
      },
    });

    for (const story of storiesToUpdate) {
      const seriesVersionsIds = story.seriesVersionsIds;
      const updatedSeriesVersionsIds = seriesVersionsIds.filter(
        (versionId) => !versionIds.includes(versionId),
      );
      await prisma.story.update({
        where: {
          id: story.id,
        },
        data: {
          seriesVersionsIds: updatedSeriesVersionsIds,
        },
      });
    }

    await prisma.seriesVersion.deleteMany({ where: { seriesId: id } });
    await prisma.series.delete({ where: { id: id } });

    return NextResponse.json({
      message: "Series deleted successfully",
      id: id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
