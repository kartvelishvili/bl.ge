import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { getDb } from "./db";
import { UserEntity } from "./entities/user.entity";

const JWT_SECRET = process.env.JWT_SECRET || "bolero-local-dev-jwt-secret-2024";

export function signToken(payload: { id: number }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { id: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAuthUser(
  req: NextRequest
): Promise<UserEntity | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;

  const db = await getDb();
  const userRepo = db.getRepository(UserEntity);
  return userRepo.findOne({ where: { id: payload.id } });
}

export function requireAuth(user: UserEntity | null): Response | null {
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
