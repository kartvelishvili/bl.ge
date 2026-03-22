import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { CompanyEntity } from "@/lib/entities/company.entity";
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
    const repo = db.getRepository(CompanyEntity);
    const company = await repo.findOne({ where: { id: Number(id) } });
    if (!company) return Response.json({ message: "Not found" }, { status: 404 });
    return Response.json(company);
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
    const repo = db.getRepository(CompanyEntity);

    const company = await repo.findOne({ where: { id: Number(id) } });
    if (!company) return Response.json({ message: "Not found" }, { status: 404 });

    if (body.name !== undefined) company.name = body.name;
    if (body.fileId !== undefined) company.fileId = body.fileId;
    if (body.secondaryFileId !== undefined) company.secondaryFileId = body.secondaryFileId;
    if (body.activeFileId !== undefined) company.activeFileId = body.activeFileId;

    const updated = await repo.save(company);
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
    await db.getRepository(CompanyEntity).softDelete(Number(id));
    return Response.json({ message: "Deleted" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
