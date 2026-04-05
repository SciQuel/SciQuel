import { type NextRequest } from "next/server";
import { getStorySchema } from "../../stories/schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedParams = getStorySchema.safeParse(
    Object.fromEntries(searchParams),
  );
}
