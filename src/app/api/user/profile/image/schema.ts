import { z } from "zod";
import { zfd } from "zod-form-data";

export const putProfileImageSchema = zfd.formData({
  file: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob),
  ),
});
