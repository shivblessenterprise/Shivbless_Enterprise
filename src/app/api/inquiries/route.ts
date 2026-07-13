import { NextRequest, NextResponse } from "next/server";
import {
  createInquiry,
  deleteInquiry,
  listInquiries,
  updateInquiryStatus,
  type Inquiry,
} from "@/lib/inquiries-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type { Inquiry };

export async function GET() {
  try {
    const inquiries = await listInquiries();
    return NextResponse.json({
      ok: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Load failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
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

    const inquiry = await createInquiry({
      name,
      email,
      product,
      quantity,
      city,
      message,
    });

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
    const inquiries = await updateInquiryStatus(body.id, body.status || "read");
    return NextResponse.json({ ok: true, inquiries });
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
    const inquiries = await deleteInquiry(id);
    return NextResponse.json({ ok: true, inquiries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
