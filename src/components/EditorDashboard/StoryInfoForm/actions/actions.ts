"use server";

import { randomUUID } from "crypto";
import { bucket, bucketUrlPrefix } from "@/lib/gcs";
import prisma from "@/lib/prisma";
import {
  Category,
  ContributionType,
  StoryTopic,
  StoryType,
  type Prisma,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { zfd } from "zod-form-data";

// const subtopicSchema = z.object({
//   id: z.string(),
// });

// const generalSubjectSchema = z.object({
//   id: z.string(),
// });

const singleFileSchema = zfd.formData({
  data: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob),
  ),
  name: zfd.text(),
});

const updateSchema = zfd.formData({
  id: zfd.text(),
  summary: z.optional(z.string()),

  image: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob).optional(),
  ),
  newImageName: z.optional(z.string()),
  imageUrl: z.optional(z.string()),
  imageCaption: z.optional(z.string()),

  storyType: z.nativeEnum(StoryType),

  category: z.nativeEnum(Category),

  title: z.optional(z.string()),
  titleColor: z.optional(z.string()),
  summaryColor: z.optional(z.string()),

  slug: z.optional(z.string()),

  topics: z.preprocess(
    (val) => (typeof val == "string" ? JSON.parse(val) : ""),
    z.array(z.nativeEnum(StoryTopic)),
  ),

  // subtopics: z.preprocess(
  //   (val) => (typeof val == "string" ? JSON.parse(val) : ""),
  //   z.array(subtopicSchema),
  // ),
  // generalSubjects: z.preprocess(
  //   (val) => (typeof val == "string" ? JSON.parse(val) : ""),
  //   z.array(generalSubjectSchema),
  // ),

  publishDate: z.string().datetime().optional(),

  // storyContent
  content: z.optional(z.string()),
  footer: z.optional(z.string()),
});

async function isEditor() {
  const userInfo = await getServerSession();

  if (userInfo?.user.email) {
    const user = await prisma.user.findFirst({
      where: {
        email: userInfo.user.email,
      },
    });

    if (user && user.roles.includes("EDITOR")) {
      return true;
    }
  }
  return false;
}

export async function isFileNameInUse(name: string) {
  try {
    const editorState = await isEditor();
    if (!editorState) {
      return undefined;
    }
    const file = bucket.file(name);
    const exists = await file.exists();
    return exists[0];
  } catch (err) {
    return undefined;
  }
}

async function uploadImage(data: Blob, name: string) {
  try {
    const editorState = await isEditor();
    if (!editorState) {
      return {
        error: "User is not an editor.",
      };
    }
    const imageMimeType = data.type;
    const extension =
      imageMimeType === "image/jpeg"
        ? "jpg"
        : imageMimeType === "image/png"
        ? "png"
        : "gif";
    // const thumbnailFilename = `${randomUUID()}.${extension}`;
    const fileName = `${name}.${extension}`;
    const inUse = await isFileNameInUse(fileName);
    if (inUse) {
      return {
        error: "name already in use",
      };
    }
    if (inUse === undefined) {
      return {
        error: "unable to verify name availability",
      };
    }
    const url = `${bucketUrlPrefix}${fileName}`;
    await bucket.file(fileName).save(Buffer.from(await data.arrayBuffer()));
    return { url };
  } catch (err) {
    return {
      error: "unknown error",
    };
  }
}

export async function singleImgUpload(form: FormData) {
  try {
    const editorState = await isEditor();
    if (!editorState) {
      return {
        error: "User is not an editor.",
      };
    }
    const parsed = singleFileSchema.safeParse(form);
    console.log(parsed.success);
    if (!parsed.success) {
      return {
        error: "invalid formdata",
      };
    }

    const result = await uploadImage(parsed.data.data, parsed.data.name);

    return result;
  } catch (err) {
    return {
      error: "unknown error",
    };
  }
}

export async function updateWholeArticle(formData: FormData) {
  try {
    const editorState = await isEditor();
    if (!editorState) {
      return {
        success: false,
        error: "User is not an editor.",
      };
    }
    const parsed = updateSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.message,
      };
    }

    const {
      id,
      summary,
      image,
      newImageName,
      imageUrl,
      imageCaption,
      storyType,
      category,
      title,
      titleColor,
      summaryColor,
      slug,
      topics,
      publishDate,
      content,
      footer,
    } = parsed.data;

    const originalStory = await prisma.story.findFirst({
      where: {
        id: id,
      },
      include: {
        storyContent: true,
      },
    });

    if (!originalStory) {
      return {
        success: false,
        error: "unknown story id",
      };
    }

    let finalThumbnailUrl = imageUrl ?? undefined;
    if (image && newImageName) {
      const uploadedTitle = await uploadImage(image, newImageName);
      if (uploadedTitle.error) {
        return {
          success: false,
          error: "failed to upload cover image.",
        };
      } else {
        finalThumbnailUrl = uploadedTitle.url ?? finalThumbnailUrl;
      }
    }

    console.log("add subtopics / gen. subjects when discussion finished");

    const query: Prisma.StoryUpdateArgs = {
      where: {
        id: id,
      },
      data: {
        summary: summary,
        thumbnailUrl: finalThumbnailUrl,
        coverCaption: imageCaption,
        storyType: storyType,
        category: category,
        title: title,
        titleColor: titleColor,
        summaryColor: summaryColor,
        slug: slug,
        topics: topics,
        publishedAt: publishDate,
      },
    };

    let bodyQuery;
    let bodyUpdatePromise;
    if (originalStory.storyContent[0]) {
      const contentToUpdate = originalStory.storyContent[0].id;
      bodyQuery = {
        where: {
          id: contentToUpdate,
        },
        data: {
          content: content,
          footer: footer,
        },
      } as Prisma.StoryContentUpdateArgs;

      bodyUpdatePromise = prisma.storyContent.update(bodyQuery);
    } else {
      bodyQuery = {
        data: {
          content: content,
          footer: footer,
          storyId: id,
        },
      } as Prisma.StoryContentCreateArgs;
      bodyUpdatePromise = prisma.storyContent.create(bodyQuery);
    }

    const storyUpdatePromise = prisma.story.update(query);

    const [storyUpdate, bodyUpdate] = await prisma.$transaction([
      storyUpdatePromise,
      bodyUpdatePromise,
    ]);

    return {
      storyUpdate,
      bodyUpdate,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Unknown server error",
    };
  }
}
