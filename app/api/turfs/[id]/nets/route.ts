import { NextRequest, NextResponse } from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/+$/, "");

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const date = request.nextUrl.searchParams.get("date") ?? "";

  const upstream = `${API_BASE}/api/turfs/${id}/nets${date ? `?date=${encodeURIComponent(date)}` : ""}`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/turfs/[id]/nets failed:", err);
    return NextResponse.json({ error: "Failed to fetch nets from upstream" }, { status: 502 });
  }
}
