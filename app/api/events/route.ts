import { NextResponse } from "next/server";
import { events } from "@/lib/backend";

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ events });
}
