import { NextResponse } from "next/server";
import { events } from "@/lib/backend";

export async function GET() {
  return NextResponse.json({ events });
}
