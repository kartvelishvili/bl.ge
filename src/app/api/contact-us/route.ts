import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ContactUsEntity } from "@/lib/entities/contact-us.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

// GET /api/contact-us (protected) + POST /api/contact-us (public)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const db = await getDb();
    const repo = db.getRepository(ContactUsEntity);
    const items = await repo.find({ order: { createdAt: "DESC" } });
    return Response.json(items);
  } catch (error) {
    console.error("ContactUs GET error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();
    const repo = db.getRepository(ContactUsEntity);

    const item = repo.create({
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      text: body.text,
    });

    const saved = await repo.save(item);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    console.error("ContactUs POST error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { id, isRead } = await req.json();
    const db = await getDb();
    const repo = db.getRepository(ContactUsEntity);
    await repo.update(id, { isRead: isRead ? true : false });
    return Response.json({ success: true });
  } catch (error) {
    console.error("ContactUs PATCH error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const { id } = await req.json();
    if (!id) {
      return Response.json({ message: "ID required" }, { status: 400 });
    }
    const db = await getDb();
    const repo = db.getRepository(ContactUsEntity);
    await repo.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("ContactUs DELETE error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
