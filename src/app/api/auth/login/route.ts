import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { UserEntity } from "@/lib/entities/user.entity";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ message: "Email and password required" }, { status: 400 });
    }

    const db = await getDb();
    const userRepo = db.getRepository(UserEntity);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id });

    return Response.json({
      token,
      id: user.id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
