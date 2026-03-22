import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductItemEntity } from "@/lib/entities/product-item.entity";
import { FileEntity } from "@/lib/entities/file.entity";
import { FoodEntity } from "@/lib/entities/food.entity";
import { ProductCategoryEntity } from "@/lib/entities/product-category.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

// GET /api/product-items - public list
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const repo = db.getRepository(ProductItemEntity);
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const isPopular = searchParams.get("isPopular");
    const productId = searchParams.get("productId");

    const qb = repo
      .createQueryBuilder("pi")
      .leftJoinAndSelect("pi.image", "image")
      .leftJoinAndSelect("pi.productCategory", "category")
      .leftJoinAndSelect("category.product", "product")
      .leftJoinAndSelect("product.file", "productFile")
      .where("pi.deletedAt IS NULL");

    if (name) {
      qb.andWhere("pi.name LIKE :name", { name: `%${name}%` });
    }
    if (isPopular === "true") {
      qb.andWhere("pi.isPopular = :pop", { pop: true });
    }
    if (productId) {
      qb.andWhere("category.productId = :productId", {
        productId: Number(productId),
      });
    }

    qb.orderBy("pi.createdAt", "DESC");
    const items = await qb.getMany();
    return Response.json(items);
  } catch (error: any) {
    console.error("ProductItems GET error:", error);
    return Response.json({ message: error?.message || "Internal server error", stack: error?.stack }, { status: 500 });
  }
}

// POST /api/product-items (protected)
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const db = await getDb();
    const repo = db.getRepository(ProductItemEntity);
    const fileRepo = db.getRepository(FileEntity);
    const foodRepo = db.getRepository(FoodEntity);

    const item = repo.create({
      name: body.name,
      imageId: body.imageId,
      description: body.description,
      alcohol: body.alcohol,
      temperature: body.temperature,
      color: body.color,
      glass: body.glass,
      fruitTones: body.fruitTones,
      tannins: body.tannins,
      sweetness: body.sweetness,
      body: body.body,
      vinificationId: body.vinificationId,
      productCategoryId: body.productCategoryId,
      companyId: body.companyId,
      isPopular: body.isPopular || false,
      composition: body.composition || null,
      viticulture: body.viticulture || null,
      aged: body.aged || null,
      volume: body.volume || null,
    });

    if (body.foodIds?.length) {
      item.foods = await foodRepo.findByIds(body.foodIds);
    }
    if (body.awardIds?.length) {
      item.awards = await fileRepo.findByIds(body.awardIds);
    }
    if (body.imageIds?.length) {
      item.images = await fileRepo.findByIds(body.imageIds);
    }

    const saved = await repo.save(item);
    return Response.json(saved, { status: 201 });
  } catch (error: any) {
    console.error("ProductItem create error:", error);
    return Response.json({ message: error?.message || "Internal server error", stack: error?.stack }, { status: 500 });
  }
}
