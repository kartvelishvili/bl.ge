import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ProductEntity } from "@/lib/entities/product.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const product = await db.getRepository(ProductEntity).findOne({
      where: { id: Number(id) },
      relations: ["file"],
    });
    if (!product) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(product);
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
    const repo = db.getRepository(ProductEntity);
    const product = await repo.findOne({ where: { id: Number(id) } });
    if (!product) return Response.json({ message: "Not found" }, { status: 404 });

    if (body.name) product.name = body.name;
    if (body.imageId) product.imageId = body.imageId;

    const updated = await repo.save(product);
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
    await db.getRepository(ProductEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
