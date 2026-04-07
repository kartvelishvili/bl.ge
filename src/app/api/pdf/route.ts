import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "s3.iserv.ge";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const isDownload = req.nextUrl.searchParams.get("download") === "1";

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

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

  const filename = decodeURIComponent(parsed.pathname.split("/").pop() || "document.pdf");
  const disposition = isDownload ? `attachment; filename="${filename}"` : "inline";

  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
