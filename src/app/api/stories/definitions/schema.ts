import { z } from "zod";
import { zfd, type json } from "zod-form-data";

export const postDefinitionSchema = zfd.formData({
  word: zfd.text(),
  definition: zfd.text(),
  exampleSentences: z.preprocess(
    (val) => (typeof val == "string" ? JSON.parse(val) : undefined),
    z.array(z.string()),
  ),
  alternativeSpellings: z.preprocess(
    (val) => (typeof val == "string" ? JSON.parse(val) : undefined),
    z.array(z.string()).optional(),
  ),
  storyId: zfd.text(),
  wordAudio: zfd.file(),
  definitionAudio: zfd.file(),
  usageAudio: zfd.file(),
});

export const getDefinitionSchema = z.object({
  storyId: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});

export const patchDefinitionSchema = zfd.formData({
  word: zfd.text().optional(),
  definition: zfd.text().optional(),
  exampleSentences: z.preprocess(
    (val) => (typeof val == "string" ? JSON.parse(val) : undefined),
    z.array(z.string()).optional(),
  ),
  alternativeSpellings: z
    .preprocess(
      (val) => (typeof val == "string" ? JSON.parse(val) : undefined),
      z.array(z.string()).optional(),
    )
    .optional(),
  storyId: zfd.text().optional(),
  wordAudio: zfd.file().optional(),
  definitionAudio: zfd.file().optional(),
  usageAudio: zfd.file().optional(),
});
