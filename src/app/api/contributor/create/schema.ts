import { z } from "zod";

export const ContributorCreateSchema = z.object({
  contributorSlug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  bio: z.string().optional(),
});
