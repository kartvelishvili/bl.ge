import AWS from "aws-sdk";

let s3: AWS.S3 | null = null;

export function getS3(): AWS.S3 {
  if (s3) return s3;
  s3 = new AWS.S3({
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_KEY,
    region: process.env.STORAGE_REGION || "us-east-1",
    s3ForcePathStyle: true,
    signatureVersion: "v4",
  });
  return s3;
}

export function getBucket(): string {
  return process.env.STORAGE_BUCKET || "svc-qartvela";
}

export function getPublicUrl(key: string): string {
  return `${process.env.STORAGE_ENDPOINT}/${getBucket()}/${key}`;
}
