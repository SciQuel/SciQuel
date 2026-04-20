import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCS_PROJECT ?? "",
  credentials: {
    client_email: process.env.GCS_CLIENT ?? "",
    private_key: process.env.GCS_KEY ?? "",
  },
});
export const bucket = storage.bucket(process.env.GCS_BUCKET ?? "");
export const bucketUrlPrefix = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/`;
