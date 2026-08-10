"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getConfirmedBooking } from "@/lib/booking";
import { CheckCircle, Calendar, Clock, MapPin, ChevronRight, Home } from "lucide-react";

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const confirmed = getConfirmedBooking();
    setBooking(confirmed);
  }, []);

  if (!booking) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,28,48,0.08)] border border-[#eff4ff] max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-[#0b1c30] mb-4">Booking not found</h1>
          <p className="text-[#434656] mb-6">We couldn't find a confirmed booking. Please book a turf or event first.</p>
          <Link
            href="/choose-activity"
            className="inline-flex items-center justify-center gap-2 bg-[#003ec7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002f96] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = booking.date;
  const bookingDetails = booking.type === "turf"
    ? `${booking.sportOrCategory} Turf Booking`
    : `${booking.sportOrCategory} Event Booking`;

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,28,48,0.08)] border border-[#eff4ff] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#e5eeff] to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#003ec7] rounded-full flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(0,62,199,0.25)]">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-black font-serif text-[#0b1c30] tracking-tight mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-[#434656] mb-8">
              Your booking is complete. Ready to enjoy your experience.
            </p>

            <div className="w-full bg-[#f8f9ff] rounded-2xl p-5 border border-[#e5eeff] text-left mb-8 shadow-inner">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#d3e4fe]">
                <span className="text-[#737688] text-sm font-semibold uppercase">Booking ID</span>
                <span className="text-[#0b1c30] font-bold font-mono">{booking.bookingId ?? booking.id ?? 'N/A'}</span>
              </div>

              <h3 className="font-bold text-[#0b1c30] text-lg mb-4">{booking.itemName}</h3>
              <p className="text-[#737688] text-sm uppercase tracking-wide mb-4">{bookingDetails}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#737688] text-xs font-semibold uppercase">Date</p>
                    <p className="text-[#0b1c30] font-medium">{formattedDate}</p>
                  </div>
                </div>

                {booking.slots?.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#737688] text-xs font-semibold uppercase">Slots</p>
                      <p className="text-[#0b1c30] font-medium">{booking.slots.join(', ')}</p>
                    </div>
                  </div>
                )}

                {booking.tierName && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#737688] text-xs font-semibold uppercase">Ticket Tier</p>
                      <p className="text-[#0b1c30] font-medium">{booking.tierName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#737688] text-xs font-semibold uppercase">Location</p>
                    <p className="text-[#0b1c30] font-medium">{booking.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between items-center mb-8 px-2">
              <span className="text-[#434656] font-medium">Total Paid</span>
              <span className="text-2xl font-extrabold text-[#003ec7]">₹{booking.total}</span>
            </div>

            <div className="w-full space-y-3">
              <Link
                href="/profile"
                className="w-full flex items-center justify-center gap-2 bg-[#003ec7] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#002f96] hover:shadow-lg transition-all"
              >
                View My Bookings
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/select-city"
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#e5eeff] text-[#0b1c30] py-3.5 rounded-xl font-bold hover:bg-[#f8f9ff] hover:border-[#003ec7] transition-all"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
