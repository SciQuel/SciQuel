import prisma from "@/lib/prisma";
import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";
import { postDefinitionSchema } from "./schema";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT ?? "",
  credentials: {
    client_email: process.env.GCS_CLIENT ?? "",
    private_key: process.env.GCS_KEY ?? "",
  },
});

// TODO: need to prevent file upload before prisma errors (how?)
// checks for duplicate uploads, user permissions?
export async function POST(req: NextResponse) {
  const parsedData = postDefinitionSchema.safeParse(await req.formData());
  console.log(parsedData);
  if (!parsedData.success) {
    console.error(parsedData.error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  try {
    const newDefinition = await prisma.dictionaryDefinition.create({
      data: {
        word: parsedData.data.word,
        definition: parsedData.data.definition,
        exampleSentences: parsedData.data.exampleSentences, // Need to fix 'any' warning (zod)
        alternativeSpellings: parsedData.data.alternativeSpellings, // Need to fix 'any' warning (zod)
        storyId: parsedData.data.storyId,
        wordAudioUrl: await uploadFile(parsedData.data.wordAudio),
        definitionAudioUrl: await uploadFile(parsedData.data.definitionAudio),
        useAudioUrl: await uploadFile(parsedData.data.usageAudio),
      },
    });
    return newDefinition;
  } catch (error) {
    console.error("Failed to save to DB:", error);
    throw new Error("Database operation failed");
  }
}

// TODO: definitely need more checks for file types, size, etc
async function uploadFile(file: File) {
  try {
    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
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
