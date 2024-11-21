"use server";

import { randomUUID } from "crypto";
import { bucket, bucketUrlPrefix } from "@/lib/gcs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { type ContributorResult } from "../actions";

const contributorImgSchema = zfd.formData({
  contributorId: zfd.text(),

  newAvatar: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob),
  ),
});

export async function replaceContributorImage(form: FormData) {
  const parsed = contributorImgSchema.safeParse(form);
  if (!parsed.success) {
    return { error: "bad form data" };
  }
  const { contributorId, newAvatar } = parsed.data;
  const newFileName = `${randomUUID()}.png`;
  const fileUrl = `${bucketUrlPrefix}${newFileName}`;
  console.log(fileUrl);
  try {
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return { error: "unauthorized" };
    }
    await bucket
      .file(newFileName)
      .save(Buffer.from(await newAvatar.arrayBuffer()));

    const contributor = await prisma.contributor.findUnique({
      where: {
        id: contributorId,
      },
    });
    console.log(contributor);
    if (!contributor) {
      return { error: "no contributor" };
    }

    if (
      contributor.avatarUrl &&
      contributor.avatarUrl.startsWith(bucketUrlPrefix) &&
      contributor.avatarUrl.endsWith(".png")
    ) {
      await bucket
        .file(contributor.avatarUrl.slice(bucketUrlPrefix.length))
        .delete({
          ignoreNotFound: true,
        });
    }

    const newContributor = await prisma.contributor.update({
      where: {
        id: contributorId,
      },
      data: {
        avatarUrl: fileUrl,
      },
    });

    return { newAvatarUrl: newContributor.avatarUrl };
  } catch (err) {
    console.error(err);
    return { error: "unknown" };
  }
}

export async function updateContributorTextFields(
  contributorId: string,
  first: string,
  last: string,
  email: string,
  slug: string,
  bio: string,
) {
  try {
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return { error: "unauthorized" };
    }

    const newContributorInfo = await prisma.contributor.update({
      where: {
        id: contributorId,
      },
      data: {
        firstName: first,
        lastName: last,
        email: email,
        contributorSlug: slug,
        bio: bio,
      },
    });

    return { contributor: newContributorInfo as ContributorResult };
  } catch (err) {
    return { error: "unknown server error" };
  }
}
