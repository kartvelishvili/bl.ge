import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SiteSettingEntity } from "@/lib/entities/site-setting.entity";

export async function GET() {
  try {
    const db = await getDb();
    const repo = db.getRepository(SiteSettingEntity);
    const settings = await repo.find();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ message: "key and value required" }, { status: 400 });
    }

    const db = await getDb();
    const repo = db.getRepository(SiteSettingEntity);

    let setting = await repo.findOne({ where: { key } });
    if (setting) {
      setting.value = String(value);
      await repo.save(setting);
    } else {
      setting = repo.create({ key, value: String(value) });
      await repo.save(setting);
    }

    return NextResponse.json({ key: setting.key, value: setting.value });
  } catch (e: any) {
    return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
  }
}
