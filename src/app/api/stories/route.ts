import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const stories = await prisma.story.findMany();
  return NextResponse.json(stories ?? []);
}
