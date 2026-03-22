import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductCategoryEntity } from "@/lib/entities/product-category.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const cat = await db.getRepository(ProductCategoryEntity).findOne({
      where: { id: Number(id) },
      relations: ["product"],
    });
    if (!cat) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(cat);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

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
    const repo = db.getRepository(ProductCategoryEntity);
    const cat = await repo.findOne({ where: { id: Number(id) } });
    if (!cat) return Response.json({ message: "Not found" }, { status: 404 });

    if (body.name) cat.name = body.name;
    if (body.productId) cat.productId = body.productId;

    const updated = await repo.save(cat);
    return Response.json(updated);
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

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
    await db.getRepository(ProductCategoryEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
