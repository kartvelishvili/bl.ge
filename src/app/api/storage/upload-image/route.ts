import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { FileEntity } from "@/lib/entities/file.entity";
import { getS3, getBucket, getPublicUrl } from "@/lib/s3";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return Response.json({ message: "No files provided" }, { status: 400 });
    }

    const s3 = getS3();
    const bucket = getBucket();
    const db = await getDb();
    const fileRepo = db.getRepository(FileEntity);
    const results = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const key = `bolero/${timestamp}-${random}-${file.name}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ACL: "public-read",
      };

      if (file.name.endsWith(".svg")) {
        params.ContentType = "image/svg+xml";
      }

      await s3.putObject(params).promise();

      const url = getPublicUrl(key);
      const fileEntity = fileRepo.create({ url, userId: user!.id });
      const saved = await fileRepo.save(fileEntity);

      results.push({ id: saved.id, url: saved.url });
    }

    return Response.json(results);
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}
