import { z } from "zod";

export default z.object({
  user: z.email(),
});
