import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductItemEntity } from "@/lib/entities/product-item.entity";

// GET /api/product-items/random/[id] - get 9 random items excluding this one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const repo = db.getRepository(ProductItemEntity);

    const items = await repo
      .createQueryBuilder("pi")
      .leftJoinAndSelect("pi.image", "image")
      .leftJoinAndSelect("pi.productCategory", "category")
      .where("pi.id != :id", { id: Number(id) })
      .andWhere("pi.deletedAt IS NULL")
      .orderBy("RAND()")
      .limit(9)
      .getMany();

    return Response.json(items);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
