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
import { PrismaClient } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { rollbackStoryHeadlineSchema } from "../schema";

console.log("Request received in rollback API");

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    // get the editor input
    const parsed = rollbackStoryHeadlineSchema.safeParse(requestBody);

    if (!parsed.success) {
      return new NextResponse(JSON.stringify({ error: parsed.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // get the input target version number
    const targetVersionNumber = parsed.data.targetVersion;

    const targetVersionContent = await prisma.historyStoryHeadline.findUnique({
      where: {
        version: targetVersionNumber,
      },
    });

    if (!targetVersionContent) {
      return new NextResponse(JSON.stringify({ error: "Version not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // find the headline that is currently active
    const currentHeadline = await prisma.curStoryHeadline.findFirst();

    if (!currentHeadline) {
      return new NextResponse(
        JSON.stringify({ error: "Current headline not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    await prisma.$transaction([
      // firstly, mark old current as not current in history
      prisma.historyStoryHeadline.update({
        where: {
          version: currentHeadline.version,
        },
        data: {
          isCurrent: false,
          updatedAt: new Date(),
        },
      }),
      // update the prevVersion in history record for the target version
      prisma.historyStoryHeadline.update({
        where: {
          version: targetVersionNumber,
        },
        data: {
          prevVersion: currentHeadline.version,
          isCurrent: true,
          updatedAt: new Date(),
        },
      }),
      // delete the current version in currentHeadline
      prisma.curStoryHeadline.delete({
        where: {
          version: currentHeadline.version,
        },
      }),
      // create a copy of headline with targetVersion
      prisma.curStoryHeadline.create({
        data: {
          id: targetVersionContent.id,
          version: targetVersionContent.version,
          // when rollback, the record of prevVersion in history version will change
          prevVersion: currentHeadline.version,
          headline: targetVersionContent.headline,
          displayHeadline: targetVersionContent.displayHeadline,
          subHeadline: targetVersionContent.subHeadline,
          headlineColor: targetVersionContent.headlineColor,
          subheadlineColor: targetVersionContent.subheadlineColor,
          headlineConfiguration: targetVersionContent.headlineConfiguration,
          headlineBackgroundColor: targetVersionContent.headlineBackgroundColor,
          isCurrent: true,
          updatedAt: new Date(),
        },
      }),
    ]);
    return new NextResponse(
      JSON.stringify({
        message: "rollback success",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error processing rollback request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
