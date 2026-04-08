import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ProductItemEntity } from "@/lib/entities/product-item.entity";

const ALLOWED_HOST = "s3.iserv.ge";

// GET /api/vinification/[id] — short URL that serves the vinification PDF inline
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const item = await db.getRepository(ProductItemEntity).findOne({
      where: { id: Number(id) },
      relations: ["vinification"],
    });

    if (!item || !item.vinification?.url) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const url = item.vinification.url;

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    if (parsed.hostname !== ALLOWED_HOST) {
      return NextResponse.json({ error: "Forbidden host" }, { status: 403 });
    }

    const resp = await fetch(url);
    if (!resp.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const contentType = resp.headers.get("content-type") || "application/pdf";
    const buf = await resp.arrayBuffer();

    const filename = decodeURIComponent(
      parsed.pathname.split("/").pop() || "vinification.pdf"
    );

    const isDownload = req.nextUrl.searchParams.get("download") === "1";
    const disposition = isDownload
      ? `attachment; filename="${filename}"`
      : "inline";

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
