import { z } from "zod";

export default z.object({ token: z.string(), password: z.string() });
