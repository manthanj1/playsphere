import { NextResponse } from "next/server";
import { createBooking, findBookingsByUserEmail } from "@/lib/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim();

  if (!email) {
    return NextResponse.json({ error: "Email query param is required." }, { status: 400 });
  }

  const bookings = findBookingsByUserEmail(email);
  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid booking payload." }, { status: 400 });
  }

  const {
    type,
    itemId,
    itemName,
    sportOrCategory,
    city,
    date,
    slots,
    tierId,
    tierName,
    amount,
    platformFee,
    total,
    location,
    userEmail,
  } = payload as Partial<{
    type: "turf" | "event";
    itemId: string;
    itemName: string;
    sportOrCategory: string;
    city: string;
    date: string;
    slots: string[];
    tierId?: string;
    tierName?: string;
    amount: number;
    platformFee: number;
    total: number;
    location: string;
    userEmail?: string;
  }>;

  if (!type || !itemId || !itemName || !sportOrCategory || !city || !date || !amount || !platformFee || !total || !location) {
    return NextResponse.json({ error: "Missing required booking fields." }, { status: 400 });
  }

  const booking = createBooking({
    type,
    itemId,
    itemName,
    sportOrCategory,
    city,
    date,
    slots: slots ?? [],
    tierId,
    tierName,
    amount,
    platformFee,
    total,
    location,
    userEmail: userEmail || "",
  });

  return NextResponse.json({ booking });
}
