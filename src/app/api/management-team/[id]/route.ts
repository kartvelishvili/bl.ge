import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ManagementTeamEntity } from "@/lib/entities/management-team.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const member = await db.getRepository(ManagementTeamEntity).findOne({
      where: { id: Number(id) },
      relations: ["image"],
    });
    if (!member) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(member);
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
    const repo = db.getRepository(ManagementTeamEntity);
    const member = await repo.findOne({ where: { id: Number(id) } });
    if (!member) return Response.json({ message: "Not found" }, { status: 404 });

    if (body.firstName) member.firstName = body.firstName;
    if (body.lastName) member.lastName = body.lastName;
    if (body.imageId) member.imageId = body.imageId;
    if (body.profession) member.profession = body.profession;

    const updated = await repo.save(member);
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
    await db.getRepository(ManagementTeamEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
