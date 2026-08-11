"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { getConfirmedBooking } from "@/lib/booking";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Home,
  Check,
  CreditCard,
  Ticket
} from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";
import { paymentService } from "@/services/paymentService";

function BookingSuccessContent() {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    async function loadBooking() {
      if (bookingId) {
        try {
          const response = await paymentService.getBookings();
          const found = response?.bookings?.find((b: any) => b.id === bookingId || b.bookingId === bookingId);
          if (found) {
            setBooking(found);
          } else {
            setBooking(getConfirmedBooking());
          }
        } catch (e) {
          setBooking(getConfirmedBooking());
        }
      } else {
        setBooking(getConfirmedBooking());
      }
      setLoading(false);
    }
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen flex items-center justify-center p-6 font-sans antialiased">
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(11,28,48,0.05)] border border-[#e5eeff] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#0b1c30] mb-3 font-serif">Booking not found</h1>
          <p className="text-[#434656] mb-8 leading-relaxed">We couldn't find a confirmed booking. Please book a turf or event first.</p>
          <Link
            href="/choose-activity"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#003ec7] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#002f96] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = booking.date ? new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : "Unknown Date";

  const bookingDetails = booking.type === "turf"
    ? `${booking.sportOrCategory} Turf Booking`
    : `${booking.sportOrCategory} Event Booking`;

  return (
    <div className="bg-[#f4f7fb] min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#003ec7]/10 to-transparent pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10">
        
        {/* Ticket Top Section */}
        <div className="bg-white rounded-t-[2rem] p-8 pb-10 shadow-[0_20px_60px_rgba(11,28,48,0.05)] border-t border-x border-[#e5eeff] relative overflow-hidden text-center">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-[#003ec7]" />
          
          <div className="relative mb-6 mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-[#003ec7]/10 rounded-full animate-ping opacity-75" />
            <div className="relative w-full h-full bg-gradient-to-tr from-[#003ec7] to-[#1a56e0] rounded-full flex items-center justify-center shadow-lg shadow-[#003ec7]/30">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold font-serif text-[#0b1c30] tracking-tight mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-[#737688] font-medium">
            Your booking is complete. Have a great time!
          </p>
        </div>

        {/* Ticket Divider (Perforated Line effect) */}
        <div className="relative bg-white border-x border-[#e5eeff] h-8 flex items-center shadow-[0_20px_60px_rgba(11,28,48,0.05)]">
           <div className="absolute -left-4 w-8 h-8 bg-[#f4f7fb] rounded-full shadow-inner" />
           <div className="absolute -right-4 w-8 h-8 bg-[#f4f7fb] rounded-full shadow-inner" />
           <div className="w-full border-t-[3px] border-dashed border-[#e5eeff] mx-6" />
        </div>

        {/* Ticket Bottom Section (Details) */}
        <div className="bg-white rounded-b-[2rem] p-8 pt-4 shadow-[0_20px_60px_rgba(11,28,48,0.05)] border-b border-x border-[#e5eeff] mb-8">
          
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-[#f0f4ff]">
             <div>
               <p className="text-[#737688] text-[11px] font-bold uppercase tracking-widest mb-1">Booking ID</p>
               <p className="text-[#0b1c30] font-bold font-mono text-sm bg-[#f8f9ff] px-2 py-1 rounded inline-block">
                 {booking.bookingId ?? booking.id ?? 'N/A'}
               </p>
             </div>
             <div className="text-right">
                <p className="text-[#737688] text-[11px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-[#003ec7] font-black text-xl">₹{booking.total}</p>
             </div>
          </div>

          <div className="mb-6">
            <h3 className="font-extrabold text-[#0b1c30] text-xl leading-tight mb-1">{booking.itemName}</h3>
            <p className="text-[#003ec7] text-xs font-bold uppercase tracking-wider bg-[#e5eeff] inline-block px-2.5 py-1 rounded-md">{bookingDetails}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                <Calendar className="w-4 h-4 text-[#0b1c30]" />
              </div>
              <div>
                <p className="text-[#737688] text-[10px] font-bold uppercase tracking-widest mb-0.5">Date</p>
                <p className="text-[#0b1c30] font-semibold text-sm">{formattedDate}</p>
              </div>
            </div>

            {booking.slots?.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                  <Clock className="w-4 h-4 text-[#0b1c30]" />
                </div>
                <div>
                  <p className="text-[#737688] text-[10px] font-bold uppercase tracking-widest mb-0.5">Time</p>
                  <p className="text-[#0b1c30] font-semibold text-sm">{booking.slots[0]}</p>
                </div>
              </div>
            )}

            {booking.tierName && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                  <Ticket className="w-4 h-4 text-[#0b1c30]" />
                </div>
                <div>
                  <p className="text-[#737688] text-[10px] font-bold uppercase tracking-widest mb-0.5">Ticket</p>
                  <p className="text-[#0b1c30] font-semibold text-sm">{booking.tierName}</p>
                </div>
              </div>
            )}

            {booking.netName && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                  <CheckCircle className="w-4 h-4 text-[#0b1c30]" />
                </div>
                <div>
                  <p className="text-[#737688] text-[10px] font-bold uppercase tracking-widest mb-0.5">Net</p>
                  <p className="text-[#0b1c30] font-semibold text-sm leading-tight">{booking.netName}</p>
                </div>
              </div>
            )}
            
            <div className="col-span-2 flex items-start gap-3 pt-4 border-t border-[#f0f4ff]">
              <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 border border-[#e5eeff]">
                <MapPin className="w-4 h-4 text-[#0b1c30]" />
              </div>
              <div>
                <p className="text-[#737688] text-[10px] font-bold uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-[#0b1c30] font-semibold text-sm">{booking.location}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 px-2">
          <Link
            href="/profile"
            className="w-full flex items-center justify-center gap-2 bg-[#003ec7] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#002f96] hover:shadow-[0_8px_24px_rgba(0,62,199,0.25)] transition-all transform hover:-translate-y-0.5"
          >
            View My Bookings
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href="/select-city"
            className="w-full flex items-center justify-center gap-2 bg-transparent text-[#434656] py-4 rounded-2xl font-bold hover:bg-[#e5eeff] hover:text-[#003ec7] transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" /></div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
