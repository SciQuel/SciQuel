import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";

async function isEditor() {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email ?? "noemail" },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  const editorStatus = await isEditor();

  if (!editorStatus) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newMessageCount = await prisma.feedback.count();

  return NextResponse.json({ new_messages: newMessageCount });
}
