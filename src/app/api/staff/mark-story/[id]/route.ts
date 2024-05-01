import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { patchSchema } from "../schema";

interface Params {
  id: string;
}
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const staffPickOld = await prisma.staffPick.findUnique({ where: { id } });
    if (!staffPickOld) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const deleteStaffPickPromise = prisma.staffPick.delete({ where: { id } });
    //create record
    const createRecordPromise = prisma.staffPickRecord.create({
      data: {
        updateType: "DELETE",
        storyId: staffPickOld.storyId,
        staffId: user.id,
        oldDescription: staffPickOld.description,
      },
    });
    await Promise.all([deleteStaffPickPromise, createRecordPromise]);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });
    const { id } = params;

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const staffPickOld = await prisma.staffPick.findUnique({ where: { id } });
    if (!staffPickOld) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const { description } = patchSchema.parse(await request.json());

    const updateStaffPickPromise = prisma.staffPick.update({
      where: { id: id },
      data: {
        description,
      },
    });
    //create record
    const createRecordPromise = prisma.staffPickRecord.create({
      data: {
        updateType: "UPDATE",
        storyId: staffPickOld.storyId,
        staffId: user.id,
        oldDescription: staffPickOld.description,
        newDescription: description,
      },
    });

    const [staffUpdate, record] = await Promise.all([
      updateStaffPickPromise,
      createRecordPromise,
    ]);
    return NextResponse.json({ staff_pick: staffUpdate }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
