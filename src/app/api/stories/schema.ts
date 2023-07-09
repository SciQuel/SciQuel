import { z } from "zod";

export const postStorySchema = z.object({
  title: z.string(),
  content: z.string(),
});
