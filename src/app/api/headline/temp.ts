// Copyright 2024 huangzheheng
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { curStoryHeadlineSchema, historyStoryHeadlineSchema } from "./schema";

const prisma = new PrismaClient();

interface StoryHeadline {
  headline: string;
  displayHeadline: string;
  subHeadline: string;
  headlineColor?: string;
  subheadlineColor?: string;
  headlineConfiguration: string;
  headlineBackgroundColor?: string;
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const action = requestBody.action;

    const parsed = historyStoryHeadlineSchema.safeParse(requestBody);
    if (!parsed.success) {
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch {}
}

async function handleCreate(data: StoryHeadline) {
  const headlineTemp = data;

  // Find the current maximum version number
  const maxVersion = await prisma.historyStoryHeadline.aggregate({
    _max: {
      version: true,
    },
  });

  const newVersion = (maxVersion._max.version || 0) + 1; // Handle case where there are no records

  const currentHeadline = await prisma.curStoryHeadline.findFirst();

  if (currentHeadline && currentHeadline.version < newVersion) {
    await prisma.$transaction([
      // Mark old current as not current in history
      prisma.historyStoryHeadline.update({
        where: {
          version: currentHeadline.version,
        },
        data: {
          isCurrent: false,
          updatedAt: new Date(),
        },
      }),
      // delete the current version in currentHeadline
      prisma.curStoryHeadline.delete({
        where: {
          version: currentHeadline.version,
        },
      }),
      // add new version to history record
      prisma.historyStoryHeadline.create({
        data: {
          ...headlineTemp,
          version: newVersion,
          prevVersion: currentHeadline.version,
          isCurrent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
      // add new version to current record
      prisma.curStoryHeadline.create({
        data: {
          ...headlineTemp,
          version: newVersion,
          prevVersion: currentHeadline.version,
          updatedAt: new Date(),
        },
      }),
    ]);
  } else if (!currentHeadline) {
    await prisma.$transaction([
      // add new version to current record
      prisma.curStoryHeadline.create({
        data: {
          ...headlineTemp,
          version: newVersion,
          prevVersion: 0,
          updatedAt: new Date(),
        },
      }),
      prisma.historyStoryHeadline.create({
        data: {
          ...headlineTemp,
          version: newVersion,
          prevVersion: 0,
          isCurrent: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ]);
  }

  return new NextResponse(
    JSON.stringify({
      message: "Story headline created",
      headlineData: headlineTemp,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
