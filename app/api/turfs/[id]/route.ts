import { NextResponse } from "next/server";
import { turfs } from "@/lib/backend";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const turf = turfs.find((item) => item.id.toString() === id);

  if (!turf) {
    return NextResponse.json({ error: "Turf not found." }, { status: 404 });
  }

  return NextResponse.json({ turf });
}
