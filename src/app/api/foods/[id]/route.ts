import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { FoodEntity } from "@/lib/entities/food.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const db = await getDb();
    const food = await db.getRepository(FoodEntity).findOne({ where: { id: Number(id) }, relations: ["image"] });
    if (!food) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(food);
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
    const repo = db.getRepository(FoodEntity);
    const food = await repo.findOne({ where: { id: Number(id) } });
    if (!food) return Response.json({ message: "Not found" }, { status: 404 });

    if (body.name) food.name = body.name;
    if (body.imageId) food.imageId = body.imageId;

    const updated = await repo.save(food);
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
    await db.getRepository(FoodEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
