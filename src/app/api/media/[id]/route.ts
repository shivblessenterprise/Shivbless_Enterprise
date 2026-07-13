import { NextRequest, NextResponse } from "next/server";
import { getMediaMeta, openMediaDownload } from "@/lib/media-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const opened = await openMediaDownload(id);
    if (!opened) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const meta = await getMediaMeta(id);
    const download = opened.bucket.openDownloadStream(opened.fileId);
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      download.on("data", (chunk: Buffer) => chunks.push(chunk));
      download.on("error", reject);
      download.on("end", () => resolve());
    });

    const buffer = Buffer.concat(chunks);
    const contentType =
      (meta?.contentType as string | undefined) || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media load failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
