import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { patchSchema, staffpickIdSchema } from "../schema";

interface Params {
  staff_pick_id: string;
}
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { staff_pick_id } = params;
    //check valid type
    const idParse = staffpickIdSchema.safeParse(staff_pick_id);
    if (!idParse.success) {
      return NextResponse.json(
        { error: idParse.error.issues[0].message },
        { status: 400 },
      );
    }

    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const staffPickOld = await prisma.staffPick.findUnique({
      where: { id: idParse.data },
    });
    if (!staffPickOld) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const deleteStaffPickPromise = prisma.staffPick.delete({
      where: { id: staff_pick_id },
    });
    //create record
    const createRecordPromise = prisma.staffPickRecord.create({
      data: {
        updateType: "DELETE",
        storyId: staffPickOld.storyId,
        staffId: user.id,
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
    const { staff_pick_id } = params;
    //check valid type
    const idParse = staffpickIdSchema.safeParse(staff_pick_id);
    if (!idParse.success) {
      return NextResponse.json(
        { error: idParse.error.issues[0].message },
        { status: 400 },
      );
    }

    const session = await getServerSession();
    const userPromise = prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });
    const staffPickOldPromise = prisma.staffPick.findUnique({
      where: { id: staff_pick_id },
    });
    const [user, staffPickOld] = await Promise.all([
      userPromise,
      staffPickOldPromise,
    ]);

    if (!user || !user.roles.includes("EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!staffPickOld) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const parseSchema = patchSchema.safeParse(await request.json());

    if (!parseSchema.success) {
      return NextResponse.json(
        { error: parseSchema.error.issues[0].message },
        { status: 400 },
      );
    }

    const description = parseSchema.data.description;

    const updateStaffPickPromise = prisma.staffPick.update({
      where: { id: staff_pick_id },
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
        description,
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
