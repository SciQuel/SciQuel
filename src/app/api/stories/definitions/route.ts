import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { postDefinitionSchema } from "./schema";

export async function POST(req: NextRequest) {
  try {
    const requestBody = postDefinitionSchema.safeParse(await req.json());
    if (!requestBody.success) {
      return NextResponse.json(
        { errors: requestBody.error.format() },
        { status: 400 },
      );
    }
    // retrieve data
    const data = requestBody.data;
    // check if story exists
    const storyExists = await prisma.story.findUnique({
      where: { id: data.storyId },
    });
    if (!storyExists) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    // create dictionary definition
    const definition = await prisma.dictionaryDefinition.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json(definition, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
