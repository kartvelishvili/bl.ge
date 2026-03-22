import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductItemEntity } from "@/lib/entities/product-item.entity";
import { FileEntity } from "@/lib/entities/file.entity";
import { FoodEntity } from "@/lib/entities/food.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

// GET /api/product-items/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const item = await db.getRepository(ProductItemEntity).findOne({
      where: { id: Number(id) },
      relations: [
        "image",
        "vinification",
        "productCategory",
        "productCategory.product",
        "company",
        "foods",
        "foods.image",
        "awards",
        "images",
      ],
    });

    if (!item) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(item);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/product-items/[id]
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
    const repo = db.getRepository(ProductItemEntity);
    const fileRepo = db.getRepository(FileEntity);
    const foodRepo = db.getRepository(FoodEntity);

    const item = await repo.findOne({
      where: { id: Number(id) },
      relations: ["foods", "awards", "images"],
    });

    if (!item) return Response.json({ message: "Not found" }, { status: 404 });

    // Update simple fields
    const fields = [
      "name", "description", "alcohol", "temperature", "color", "glass",
      "fruitTones", "tannins", "sweetness", "body", "isPopular",
      "composition", "viticulture", "aged", "volume",
      "imageId", "vinificationId", "productCategoryId", "companyId",
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        (item as any)[field] = body[field];
      }
    }

    // Update relations
    if (body.foodIds) {
      item.foods = await foodRepo.findByIds(body.foodIds);
    }
    if (body.awardIds) {
      item.awards = await fileRepo.findByIds(body.awardIds);
    }
    if (body.imageIds) {
      item.images = await fileRepo.findByIds(body.imageIds);
    }

    const updated = await repo.save(item);
    return Response.json(updated);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/product-items/[id]
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
    await db.getRepository(ProductItemEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
