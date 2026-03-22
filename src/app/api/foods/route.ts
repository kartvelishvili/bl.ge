import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { FoodEntity } from "@/lib/entities/food.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const db = await getDb();
    const foods = await db.getRepository(FoodEntity).find({ relations: ["image"], order: { createdAt: "DESC" } });
    return Response.json(foods);
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
    const repo = db.getRepository(FoodEntity);
    const food = repo.create({ name: body.name, imageId: body.imageId });
    const saved = await repo.save(food);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
