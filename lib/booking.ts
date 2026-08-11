export interface BookingSummary {
  bookingId?: string;
  type: "turf" | "event";
  itemId: string;
  itemName: string;
  sportOrCategory: string;
  city: string;
  /** Human-readable display date, e.g. "7 Aug 2026" */
  date: string;
  /** Raw ISO date string (YYYY-MM-DD) used for API calls */
  bookingDate?: string;
  slots: string[];
  tierId?: string;
  tierName?: string;
  amount: number;
  platformFee: number;
  total: number;
  location: string;
  createdAt?: string;
  /** Net fields — populated by the Net Selection page */
  netId?: string;
  netName?: string;
  netIds?: string[];
  netNames?: string[];
  areaType?: "INDOOR" | "OUTDOOR" | "MIXED";
  quantity?: number; // Added for event extra persons
}

const CURRENT_BOOKING_KEY = "playsphere_current_booking";
const CONFIRMED_BOOKING_KEY = "playsphere_confirmed_booking";

export function saveCurrentBooking(booking: BookingSummary) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENT_BOOKING_KEY, JSON.stringify(booking));
}

export function getCurrentBooking(): BookingSummary | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CURRENT_BOOKING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingSummary;
  } catch {
    return null;
  }
}

export function clearCurrentBooking() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_BOOKING_KEY);
}

export function saveConfirmedBooking(booking: BookingSummary) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONFIRMED_BOOKING_KEY, JSON.stringify(booking));
}

export function getConfirmedBooking(): BookingSummary | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONFIRMED_BOOKING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BookingSummary;
  } catch {
    return null;
  }
}

export function clearConfirmedBooking() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONFIRMED_BOOKING_KEY);
}
