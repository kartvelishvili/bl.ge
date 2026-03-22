import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { BlogEntity } from "@/lib/entities/blog.entity";
import { FileEntity } from "@/lib/entities/file.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

// GET /api/blogs/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const blogRepo = db.getRepository(BlogEntity);

    const blog = await blogRepo.findOne({
      where: { id: Number(id) },
      relations: ["file", "gallery"],
    });

    if (!blog) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    console.error("Blog GET error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/blogs/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();
    const blogRepo = db.getRepository(BlogEntity);
    const fileRepo = db.getRepository(FileEntity);

    const blog = await blogRepo.findOne({
      where: { id: Number(id) },
      relations: ["gallery"],
    });

    if (!blog) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    if (body.title) blog.title = body.title;
    if (body.description) blog.description = body.description;
    if (body.fileId) blog.fileId = body.fileId;
    if (body.type) blog.type = body.type;
    if (body.visibleOnHome !== undefined) blog.visibleOnHome = body.visibleOnHome;
    if (body.galleryIds) {
      blog.gallery = await fileRepo.findByIds(body.galleryIds);
    }

    const updated = await blogRepo.save(blog);
    return Response.json(updated);
  } catch (error) {
    console.error("Blog PUT error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const db = await getDb();
    const blogRepo = db.getRepository(BlogEntity);

    await blogRepo.softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
