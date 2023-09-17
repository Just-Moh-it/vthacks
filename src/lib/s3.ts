import { env } from "~/env.mjs";
import { S3Client } from "@aws-sdk/client-s3";

// AWS_S3: `https://${bucketName}.s3.amazonaws.com`,
export const endpoint = `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
export const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;

export const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const R2_CUSTOM_DOMAIN = "https://r2.maxroom.co" as const;
export const createS3Url = (filename: string) => {
  /**
   * * Use Vercel's env instead of local env.NODE_ENV, so that Bucket URL is correct.
   * * Vercel env Docs: https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
   */
  const baseURL =
    process.env?.VERCEL_ENV === "production"
      ? R2_CUSTOM_DOMAIN
      : env.CLOUDFLARE_R2_BUCKET_DEV_URL;

  const fileURL = `${baseURL}/${filename}`;
  return fileURL;
};
