import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env.mjs";
import {
  PRESEIGNED_GET_URL_VALIDITY_IN_SECONDS,
  PRESEIGNED_UPLOAD_URL_VALIDITY_IN_SECONDS,
} from "~/lib/constants";
import { createS3Url, s3 } from "~/lib/s3";

export const getPresignedUploadUrl = async (props: {
  name: string;
  type: string;
}) => {
  const key = `${props.name.replace(/ /g, "_")}.${Date.now()}`;

  const command = new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    ContentType: props.type,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: PRESEIGNED_UPLOAD_URL_VALIDITY_IN_SECONDS,
  });

  return {
    signedUploadUrl: signedUrl,
    key,
  };
};

export const getPresignedGetUrl = async (props: { key: string }) => {
  const command = new GetObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: props.key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: PRESEIGNED_GET_URL_VALIDITY_IN_SECONDS,
  });

  return url;
};

export type AudioContentType = "audio/mpeg" | "audio/aac";
export type ImageContentType = "image/jpeg" | "image/png";
export type VideoContentType = "video/mp4";
export type AcceptedFileContentType =
  | AudioContentType
  | ImageContentType
  | VideoContentType
  | "application/octet-stream";

export const uploadToS3 = async (props: {
  fileContents: Blob | Buffer | Uint8Array;
  /**
   * * Example: `user_123/media/abc.mp3`.
   * * Do not include `/` in the beginning.
   */
  fullPathOfFile: string;
  contentType: AcceptedFileContentType;
}) => {
  const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
  const sentObject = await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: props.fullPathOfFile,
      Body: props.fileContents,
      ContentType: props.contentType,
    }),
  );

  //   ETag is basically the md5 hash of the file contents.
  if (!sentObject.ETag) throw new Error("Error uploading to S3");
  const url = createS3Url(props.fullPathOfFile);
  return { isUploadSuccess: true, url };
};

export const doesFileAlreadyExist = async (fullPathOfFile: string) => {
  try {
    const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
    const res = await s3.send(
      new GetObjectCommand({ Bucket: bucketName, Key: fullPathOfFile }),
    );
    return !!res.ETag;
  } catch {
    return false;
  }
};

export const generateFullFilePath = (props: {
  fileName: string;
  assetType: // Uploaded by us  👇
  | "text-to-speech-audio"
    | "image"
    | "video"
    | "blob"
    // Uploaded by User  👇
    | "custom-voice-sample"
    | "custom-image"
    | "custom-video"
    | "custom-speech-audio";
}) => {
  let url: string;

  // TODO: Implement all asset types

  switch (props.assetType) {
    case "text-to-speech-audio":
      url = `user_assets/tts/${props.fileName}`;
      break;

    case "custom-voice-sample":
      url = `user_assets/voice_samples/${props.fileName}`;
      break;

    default:
      throw new Error(
        `Please add a valid asset-type switch handler to generateFullFilePath`,
      );
  }

  return url;
};
