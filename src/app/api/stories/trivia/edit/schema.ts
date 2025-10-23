import { z } from "zod";
import {
  complexMatchingSubpartSchema,
  directMatchingSubpartSchema,
  multipleChoiceSubpartSchema,
  selectAllSubpartSchema,
  trueFalseSubpartSchema,
} from "../subpartSchemas";

const postTriviaEditBaseSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
  max_score: z.number().int().nonnegative().default(10),
  subheader: z.string(),
});

const patchTriviaEditBaseSchema = z.object({
  question_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
  max_score: z.number().int().nonnegative().default(10),
  subheader: z.string(),
});

const triviaEditMultipleChoiceSchema = z.object({
  question_type: z.literal("MULTIPLE_CHOICE"),
  subpart: multipleChoiceSubpartSchema,
});

const triviaEditTrueFalseSchema = postTriviaEditBaseSchema.extend({
  question_type: z.literal("TRUE_FALSE"),
  subpart: trueFalseSubpartSchema,
});

const triviaEditDirectMatchingSchema = postTriviaEditBaseSchema.extend({
  question_type: z.literal("DIRECT_MATCHING"),
  subpart: directMatchingSubpartSchema,
});

const triviaEditComplexMatchingSchema = postTriviaEditBaseSchema.extend({
  question_type: z.literal("COMPLEX_MATCHING"),
  subpart: complexMatchingSubpartSchema,
});

const triviaEditSelectAllSchema = postTriviaEditBaseSchema.extend({
  question_type: z.literal("SELECT_ALL"),
  subpart: selectAllSubpartSchema,
});

export const postTriviaEditSchema = z.union([
  triviaEditMultipleChoiceSchema.merge(postTriviaEditBaseSchema),
  triviaEditTrueFalseSchema.merge(postTriviaEditBaseSchema),
  triviaEditDirectMatchingSchema.merge(postTriviaEditBaseSchema),
  triviaEditComplexMatchingSchema.merge(postTriviaEditBaseSchema),
  triviaEditSelectAllSchema.merge(postTriviaEditBaseSchema),
]);

export const patchTriviaEditSchema = z.union([
  triviaEditMultipleChoiceSchema.merge(patchTriviaEditBaseSchema),
  triviaEditTrueFalseSchema.merge(patchTriviaEditBaseSchema),
  triviaEditDirectMatchingSchema.merge(patchTriviaEditBaseSchema),
  triviaEditComplexMatchingSchema.merge(patchTriviaEditBaseSchema),
  triviaEditSelectAllSchema.merge(patchTriviaEditBaseSchema),
]);
