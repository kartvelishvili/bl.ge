import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductEntity } from "@/lib/entities/product.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.getRepository(ProductEntity).find({
      relations: ["file"],
      order: { sortOrder: "ASC" },
    });
    return Response.json(products);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const db = await getDb();
    const repo = db.getRepository(ProductEntity);

    const maxResult = await repo
      .createQueryBuilder("p")
      .select("MAX(p.sortOrder)", "max")
      .getRawOne();
    const nextOrder = (maxResult?.max ?? 0) + 1;

    const product = repo.create({ name: body.name, imageId: body.imageId, sortOrder: nextOrder });
    const saved = await repo.save(product);
    return Response.json(saved, { status: 201 });
  } catch (error) {
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
    const repo = db.getRepository(ProductEntity);

    for (let i = 0; i < orderedIds.length; i++) {
      await repo.update(orderedIds[i], { sortOrder: i + 1 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
