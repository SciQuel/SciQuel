import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import slug from "slug";
import {
  getSeriesSchema,
  postSeriesSchema,
  updateSeriesSchema,
} from "./schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsedParams = getSeriesSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  try {
    const series = await prisma.series.findMany({
      where: {
        ...(parsedParams.data.seriesName
          ? {
              seriesName: {
                contains: parsedParams.data.seriesName,
                mode: "insensitive",
              },
            }
          : {}),
        ...(parsedParams.data.seriesSlug
          ? { seriesSlug: parsedParams.data.seriesSlug }
          : {}),
        ...(parsedParams.data.seriesURL
          ? { seriesURL: parsedParams.data.seriesURL }
          : {}),
        ...(parsedParams.data.seriesPublishStatus
          ? { seriesPublishStatus: parsedParams.data.seriesPublishStatus }
          : {}),
        ...(parsedParams.data.seriesDescription
          ? {
              seriesDescription: {
                contains: parsedParams.data.seriesDescription,
                mode: "insensitive",
              },
            }
          : {}),
      },
      include: {
        stories: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { lastUpdatedDate: "desc" },
    });

    return NextResponse.json({ series });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
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

    const parsedRequest = postSeriesSchema.safeParse(await request.formData());
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
    const data = parsedRequest.data;

    const now = new Date();

    const seriesSlug = data.seriesSlug || slug(data.seriesName);

    const scheduledPublishDate = data.scheduledPublishDate;
    const seriesURL = scheduledPublishDate
      ? `sciquel.org/series/${scheduledPublishDate.getFullYear()}/${
          scheduledPublishDate.getMonth() + 1
        }/${scheduledPublishDate.getDate()}/${seriesSlug}`
      : "no URL";

    const newSeries = await prisma.series.create({
      data: {
        createdDate: now,
        createdBy: user.id,
        scheduledPublishDate: scheduledPublishDate,
        publishedDate: scheduledPublishDate,
        publishedByScheduler: scheduledPublishDate != undefined,
        seriesPublishStatus:
          scheduledPublishDate == undefined ? "VISIBLE" : "SCHEDULED",
        seriesURL: seriesURL,
        seriesName: data.seriesName,
        seriesSlug: seriesSlug,
        seriesDescription: data.seriesDescription,
      },
    });

    return NextResponse.json({ id: newSeries.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function UPDATE(request: NextRequest) {
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

    const parsedRequest = updateSeriesSchema.safeParse(
      await request.formData(),
    );
    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const existingSeries = await prisma.series.findUnique({
      where: { id: parsedRequest.data.id },
    });

    if (!existingSeries) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (existingSeries.createdBy != user.id) {
      return NextResponse.json(
        { error: "Can not edit other user's series" },
        { status: 400 },
      );
    }

    const updatedSeriesData = {
      lastUpdatedDate: new Date(),
      ...parsedRequest.data,
    };

    await prisma.series.update({
      where: { id: parsedRequest.data.id },
      data: updatedSeriesData,
    });

    return NextResponse.json({ id: parsedRequest.data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
