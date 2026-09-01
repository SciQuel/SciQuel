import { z } from "zod";

export const postSchema = z.object({
  story_id: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "story_id is required"
          : "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      error: "story_id must be a valid ObjectId",
    }),
  description: z.string({
    error: (issue) =>
      issue.input === undefined ? "description is required" : undefined,
  }),
  author_name: z.string({
    required_error: "author_name is required",
  }),
});
export const patchSchema = z.object({
  description: z.string({
    error: (issue) =>
      issue.input === undefined ? "description is required" : undefined,
  }),
  author_name: z.string({
    required_error: "author_name is required",
  }),
});

export const staffpickIdSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "staff_pick_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, {
    error: "staff_pick_id must be a valid ObjectId",
  });
