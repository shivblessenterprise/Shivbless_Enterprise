import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  product: string;
  quantity: string;
  city: string;
  message: string;
  createdAt: string;
  status: "new" | "read";
};

const FILE = path.join(process.cwd(), "data", "inquiries.json");

async function readInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as { inquiries?: Inquiry[] } | Inquiry[];
    const list = Array.isArray(parsed) ? parsed : parsed.inquiries;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writeInquiries(inquiries: Inquiry[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(
    FILE,
    JSON.stringify({ updatedAt: new Date().toISOString(), inquiries }, null, 2),
    "utf8"
  );
}

export async function GET() {
  const inquiries = await readInquiries();
  return NextResponse.json({
    ok: true,
    count: inquiries.length,
    inquiries,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Inquiry>;
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const product = String(body.product || "").trim();
    const quantity = String(body.quantity || "").trim();
    const message = String(body.message || "").trim();
    const city = String(body.city || "").trim();

    if (!name || !email || !product || !quantity || !message) {
      return NextResponse.json(
        { ok: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      product,
      quantity,
      city,
      message,
      createdAt: new Date().toISOString(),
      status: "new",
    };

    const list = await readInquiries();
    list.unshift(inquiry);
    await writeInquiries(list);

    return NextResponse.json({
      ok: true,
      inquiry,
      message: "Bulk inquiry submitted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { id?: string; status?: "new" | "read" };
    if (!body.id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const list = await readInquiries();
    const next = list.map((item) =>
      item.id === body.id
        ? { ...item, status: body.status || "read" }
        : item
    );
    await writeInquiries(next);
    return NextResponse.json({ ok: true, inquiries: next });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const list = await readInquiries();
    const next = list.filter((item) => item.id !== id);
    await writeInquiries(next);
    return NextResponse.json({ ok: true, inquiries: next });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
