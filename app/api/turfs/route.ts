import { NextResponse } from "next/server";
import { turfs } from "@/lib/backend";

export async function GET() {
  return NextResponse.json({ turfs });
}
