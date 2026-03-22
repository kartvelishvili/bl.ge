import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductCategoryEntity } from "@/lib/entities/product-category.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const repo = db.getRepository(ProductCategoryEntity);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const productId = searchParams.get("productId");

    const qb = repo
      .createQueryBuilder("pc")
      .leftJoinAndSelect("pc.product", "product")
      .leftJoinAndSelect("product.file", "productFile")
      .where("pc.deletedAt IS NULL");

    if (name) {
      qb.andWhere("pc.name LIKE :name", { name: `%${name}%` });
    }
    if (productId) {
      qb.andWhere("pc.productId = :productId", { productId: Number(productId) });
    }

    qb.orderBy("pc.createdAt", "DESC");
    const categories = await qb.getMany();
    return Response.json(categories);
  } catch (error) {
    console.error("ProductCategory GET error:", error);
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
    const repo = db.getRepository(ProductCategoryEntity);

    const category = repo.create({
      name: body.name,
      productId: body.productId,
    });

    const saved = await repo.save(category);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
