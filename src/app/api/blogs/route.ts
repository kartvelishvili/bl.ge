import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { BlogEntity } from "@/lib/entities/blog.entity";
import { FileEntity } from "@/lib/entities/file.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { IsNull } from "typeorm";

// GET /api/blogs - public list
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const blogRepo = db.getRepository(BlogEntity);
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const visibleOnHome = searchParams.get("visibleOnHome");
    const name = searchParams.get("name"); // admin search

    const qb = blogRepo
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.file", "file")
      .where("blog.deletedAt IS NULL");

    if (type) {
      qb.andWhere("blog.type = :type", { type });
    }
    if (visibleOnHome === "true") {
      qb.andWhere("blog.visibleOnHome = :vh", { vh: true });
    } else if (visibleOnHome === "false") {
      qb.andWhere("blog.visibleOnHome = :vh", { vh: false });
    }
    if (name) {
      qb.andWhere("blog.title LIKE :name", { name: `%${name}%` });
    }

    qb.orderBy("blog.sortOrder", "ASC");

    const blogs = await qb.getMany();
    return Response.json(blogs);
  } catch (error) {
    console.error("Blogs GET error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/blogs - create (protected)
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const db = await getDb();
    const blogRepo = db.getRepository(BlogEntity);
    const fileRepo = db.getRepository(FileEntity);

    const maxResult = await blogRepo
      .createQueryBuilder("b")
      .select("MAX(b.sortOrder)", "max")
      .getRawOne();
    const nextOrder = (maxResult?.max ?? 0) + 1;

    const blog = blogRepo.create({
      title: body.title,
      description: body.description,
      fileId: body.fileId,
      type: body.type,
      visibleOnHome: body.visibleOnHome || false,
      sortOrder: nextOrder,
    });

    if (body.galleryIds?.length) {
      blog.gallery = await fileRepo.findByIds(body.galleryIds);
    }

    const saved = await blogRepo.save(blog);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return Response.json({ message: "orderedIds must be an array" }, { status: 400 });
    }

    const db = await getDb();
    const repo = db.getRepository(BlogEntity);

    for (let i = 0; i < orderedIds.length; i++) {
      await repo.update(orderedIds[i], { sortOrder: i + 1 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Blog PATCH error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
