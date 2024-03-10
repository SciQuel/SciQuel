import { ContributionType } from "@prisma/client";
import { z } from "zod";

export const getContributionSchema = z.object({
    id: z.string().optional(), 
    userId: z.string().optional(), 
    storyId: z.string().optional(), 
    contributionType: z.nativeEnum(ContributionType).optional(), 
    bio: z.string().optional(), 
});

// export const getContributorSchema = z.object({
//   contributorId: z.string().optional(), 
//   firstName: z.string().optional()
//   lastName: z.string().optional()
//   userId: z.string().optional(), 
//   storyId: z.string().optional(), 
// });