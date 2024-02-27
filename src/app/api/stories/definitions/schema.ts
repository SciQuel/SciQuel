import { z } from "zod";

export const postDefinitionSchema = z.object({
  word: z.string(),
  definition: z.string(),
  exampleSentences: z.array(z.string()),
  alternativeSpellings: z.array(z.string()),
  storyId: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});
