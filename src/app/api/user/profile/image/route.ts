import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { putProfileImageSchema } from "./schema";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT ?? "",
  credentials: {
    client_email: process.env.GCS_CLIENT ?? "",
    private_key: process.env.GCS_KEY ?? "",
  },
});
const bucket = storage.bucket(process.env.GCS_BUCKET ?? "");
const bucketUrlPrefix = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/`;

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const parsedForm = putProfileImageSchema.safeParse(formData);

    if (!parsedForm.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { file } = parsedForm.data;

    const filename = `${randomUUID()}.png`;
    const fileUrl = `${bucketUrlPrefix}${filename}`;

    await bucket.file(filename).save(Buffer.from(await file.arrayBuffer()));

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (
      user?.avatarUrl &&
      user.avatarUrl.startsWith(bucketUrlPrefix) &&
      user.avatarUrl.endsWith(".png")
    ) {
      await bucket
        .file(user.avatarUrl.slice(bucketUrlPrefix.length))
        .delete({ ignoreNotFound: true });
    }
    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatarUrl: fileUrl },
    });

    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session?.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (
      user?.avatarUrl &&
      user.avatarUrl.startsWith(bucketUrlPrefix) &&
      user.avatarUrl.endsWith(".png")
    ) {
      await bucket
        .file(user.avatarUrl.slice(bucketUrlPrefix.length))
        .delete({ ignoreNotFound: true });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatarUrl: null },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
