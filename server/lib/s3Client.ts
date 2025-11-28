import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.NUXT_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.NUXT_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NUXT_R2_SECRET_ACCESS_KEY!,
  },
});
