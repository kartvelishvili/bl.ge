import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ManagementTeamEntity } from "@/lib/entities/management-team.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const repo = db.getRepository(ManagementTeamEntity);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    const qb = repo
      .createQueryBuilder("mt")
      .leftJoinAndSelect("mt.image", "image")
      .where("mt.deletedAt IS NULL");

    if (query) {
      qb.andWhere("(mt.firstName LIKE :q OR mt.lastName LIKE :q)", { q: `%${query}%` });
    }

    qb.orderBy("mt.sortOrder", "ASC");

    const items = await qb.getMany();
    return Response.json(items);
  } catch (error) {
    console.error("ManagementTeam GET error:", error);
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
    const repo = db.getRepository(ManagementTeamEntity);

    const maxResult = await repo
      .createQueryBuilder("mt")
      .select("MAX(mt.sortOrder)", "max")
      .getRawOne();
    const nextOrder = (maxResult?.max ?? 0) + 1;

    const member = repo.create({
      firstName: body.firstName,
      lastName: body.lastName,
      imageId: body.imageId,
      profession: body.profession,
      sortOrder: nextOrder,
    });

    const saved = await repo.save(member);
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
    const repo = db.getRepository(ManagementTeamEntity);

    for (let i = 0; i < orderedIds.length; i++) {
      await repo.update(orderedIds[i], { sortOrder: i + 1 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("ManagementTeam PATCH error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
