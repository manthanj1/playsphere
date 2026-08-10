import { NextResponse } from "next/server";
import { createOrUpdateUser, findUserByEmail } from "@/lib/backend";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const {
    name,
    email,
    phone,
    location,
    city,
    imageUrl,
    bookingsCount,
    tournamentsCount,
  } = body as Record<string, any>;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const userPayload = {
    name: name || "Player One",
    email,
    phone: phone || "",
    location: location || "Gujarat, India",
    city: city || "Ahmedabad",
    bookingsCount: bookingsCount ?? 0,
    tournamentsCount: tournamentsCount ?? 0,
    imageUrl: imageUrl || "",
  };

  const savedUser = createOrUpdateUser(userPayload);

  return NextResponse.json({
    user: savedUser,
  });
}
