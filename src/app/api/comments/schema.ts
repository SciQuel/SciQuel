import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string(),
  quote: z.string().optional(),
  parentCommentId: z.string().optional(),
  userEmail: z.string({
    required_error: "user_email is required",
  }),
  storyId: z.string(),
});

// export const createReplySchema = z.object({
//   content: z.string(),
//   quote: z.string().optional(),
//   parentCommentId: z.string(),
//   userId: z.string(),
//   storyId: z.string(),
// });

export const getCommentsSchema = z.object({
  storyId: z.string(),
});
