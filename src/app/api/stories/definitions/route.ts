import { randomUUID } from "crypto";
import { parse } from "path";
import prisma from "@/lib/prisma";
import { Storage } from "@google-cloud/storage";
import { type DictionaryDefinition } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import {
  getDefinitionSchema,
  patchDefinitionSchema,
  postDefinitionSchema,
} from "./schema";

export type DictionaryDefinitions = DictionaryDefinition[];

export type GetDefinitionsResult = {
  dictionaryDefinitions: DictionaryDefinitions;
};

const storage = new Storage({
  projectId: process.env.GCS_PROJECT ?? "",
  credentials: {
    client_email: process.env.GCS_CLIENT ?? "",
    private_key: process.env.GCS_KEY ?? "",
  },
});

interface UpdateData {
  word?: string;
  wordAudioUrl?: string;
  definitionAudioUrl?: string;
  usageAudioUrl?: string;
  [key: string]: any;
}

// TODO: definitely need more checks for file types, size, etc
async function uploadFile(file: File) {
  try {
    console.log(file.type);
    //to check if the file is audio and the size is less than 10MB
    if (file.type !== "video/mp4") {
      throw new Error("Invalid file type. Please upload an audio file");
    } else if (file.size > 10000000) {
      throw new Error(
        "File size too large. Please upload a file less than 10MB",
      );
    }
    const buffer = await file.arrayBuffer();
    const fileName = `${randomUUID()}-${file.name}`;
    const fileUrl = `https://storage.googleapis.com/sciquel-dictionary-audio/${fileName}`;
    await storage
      .bucket("sciquel-dictionary-audio")
      .file(fileName)
      .save(Buffer.from(buffer));
    return fileUrl;
  } catch (error) {
    console.error("File failed to upload to GCS", error);
    throw new Error("Failed to upload file");
  }
}

// TODO: need to prevent file upload before prisma errors (how?)
// checks for duplicate uploads, user permissions?
//need to check the role of current user, should be editor
export async function POST(req: NextResponse) {
  const parsedData = postDefinitionSchema.safeParse(await req.formData());
  console.log(parsedData);
  if (!parsedData.success) {
    console.error(parsedData.error);
    return NextResponse.json({ error: parsedData.error }, { status: 400 });
  }

  //check authentication.
  // const session = await getServerSession();
  // const user = await prisma.user.findUnique({
  //   where: { email: session?.user.email ?? "noemail" },
  // });

  // if (!user || !user.roles.includes("EDITOR")) {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  try {
    const newDefinition = await prisma.dictionaryDefinition.create({
      data: {
        word: parsedData.data.word,
        definition: parsedData.data.definition,
        exampleSentences: parsedData.data.exampleSentences, // Need to fix 'any' warning (zod)
        alternativeSpellings: parsedData.data.alternativeSpellings, // Need to fix 'any' warning (zod)
        storyId: parsedData.data.storyId,
        wordAudioUrl: parsedData.data.wordAudio
          ? await uploadFile(parsedData.data.wordAudio as File)
          : undefined,
        definitionAudioUrl: parsedData.data.definitionAudio
          ? await uploadFile(parsedData.data.definitionAudio as File)
          : undefined,
        useAudioUrl: parsedData.data.usageAudio
          ? await uploadFile(parsedData.data.usageAudio as File)
          : undefined,
      },
    });
    return NextResponse.json({ data: newDefinition }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getDefinitionSchema.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsedParams.success) {
    return NextResponse.json(parsedParams.error, { status: 400 });
  }

  const { storyId } = parsedParams.data;

  try {
    const dictionaryDefinitions = await prisma.dictionaryDefinition.findMany({
      where: { storyId: storyId },
    });
    return NextResponse.json({ dictionaryDefinitions }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch dictionary definitions for story", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const parsedData = patchDefinitionSchema.safeParse(formData);

  if (!parsedData.success) {
    console.error(parsedData.error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const updateData: UpdateData = {};
  const fieldsToUpdate = Object.keys(parsedData.data);

  for (const field of fieldsToUpdate) {
    if (field === "wordAudio" && parsedData.data.wordAudio) {
      updateData.wordAudioUrl = await uploadFile(
        parsedData.data.wordAudio as File,
      );
    } else if (field === "definitionAudio" && parsedData.data.definitionAudio) {
      updateData.definitionAudioUrl = await uploadFile(
        parsedData.data.definitionAudio as File,
      );
    } else if (field === "usageAudio" && parsedData.data.usageAudio) {
      updateData.usageAudioUrl = await uploadFile(
        parsedData.data.usageAudio as File,
      );
    } else if (
      field === "word" ||
      field === "definition" ||
      field === "exampleSentences" ||
      field === "alternativeSpellings" ||
      field === "alternativeSpellings"
    ) {
      updateData[field] = parsedData.data[field];
    }
  }

  const id = formData.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "ID is required for update" },
      { status: 400 },
    );
  }

  try {
    const updatedDefinition = await prisma.dictionaryDefinition.update({
      where: { id: id.toString() },
      data: updateData,
    });
    return NextResponse.json({ data: updatedDefinition }, { status: 200 });
  } catch (error) {
    console.error("Failed to update dictionary definition", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
