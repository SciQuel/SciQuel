import { z } from "zod";

export const getTriviaSchema = z.object({
  story_id: z.string({
    required_error: "story_id is required",
    invalid_type_error: "story_id must be a ObjectId",
  }),
});
