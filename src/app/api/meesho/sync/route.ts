import { NextResponse } from "next/server";
import { syncMeeshoProducts } from "@/lib/meesho-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await syncMeeshoProducts();
  return NextResponse.json(result);
}

export async function POST() {
  const result = await syncMeeshoProducts();
  return NextResponse.json(result);
}
