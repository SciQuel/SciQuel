import { z } from "zod";
import { zfd, type json } from "zod-form-data";

// TODO: change alternativeSpellings and exampleSentence type
// to avoid 'any' warning
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
