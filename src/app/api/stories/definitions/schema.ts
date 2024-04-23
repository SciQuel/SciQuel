import { z } from "zod";
import { zfd, type json } from "zod-form-data";

// TODO: change alternativeSpellings and exampleSentence type
// to avoid 'any' warning
export const postDefinitionSchema = zfd.formData({
  word: zfd.text(),
  definition: zfd.text(),
  exampleSentences: zfd
    .text()
    .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
      try {
        return JSON.parse(str);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: "Invalid JSON" });
        return z.NEVER;
      }
    }),
  alternativeSpellings: zfd
    .text()
    .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
      try {
        return JSON.parse(str);
      } catch (e) {
        ctx.addIssue({ code: "custom", message: "Invalid JSON" });
        return z.NEVER;
      }
    })
    .optional(),
  storyId: zfd.text(),
  wordAudio: zfd.file(),
  definitionAudio: zfd.file(),
  usageAudio: zfd.file(),
});
