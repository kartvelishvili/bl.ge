import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { UserEntity } from "@/lib/entities/user.entity";
import { getAuthUser, requireAuth, hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const db = await getDb();
    const repo = db.getRepository(UserEntity);
    const users = await repo.find({
      select: ["id", "userName", "email", "createdAt"],
      order: { createdAt: "DESC" },
    });
    return Response.json(users);
  } catch (error) {
    console.error("Users GET error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    if (!body.email || !body.password || !body.userName) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    const db = await getDb();
    const repo = db.getRepository(UserEntity);

    const existing = await repo.findOne({ where: { email: body.email } });
    if (existing) {
      return Response.json({ message: "Email already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(body.password);
    const newUser = repo.create({
      userName: body.userName,
      email: body.email,
      password: hashed,
    });

    const saved = await repo.save(newUser);
    return Response.json(
      { id: saved.id, userName: saved.userName, email: saved.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Users POST error:", error);
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

    if (user!.id === id) {
      return Response.json({ message: "Cannot delete yourself" }, { status: 400 });
    }

    const db = await getDb();
    const repo = db.getRepository(UserEntity);
    await repo.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    if (!body.id) {
      return Response.json({ message: "ID required" }, { status: 400 });
    }

    const db = await getDb();
    const repo = db.getRepository(UserEntity);
    const target = await repo.findOne({ where: { id: body.id } });
    if (!target) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (body.userName) target.userName = body.userName;

    if (body.email && body.email !== target.email) {
      const dup = await repo.findOne({ where: { email: body.email } });
      if (dup && dup.id !== target.id) {
        return Response.json({ message: "Email already exists" }, { status: 409 });
      }
      target.email = body.email;
    }

    if (body.password) {
      target.password = await hashPassword(body.password);
    }

    await repo.save(target);
    return Response.json({ id: target.id, userName: target.userName, email: target.email });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
