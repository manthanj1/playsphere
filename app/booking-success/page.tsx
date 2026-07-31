"use client";

import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, ChevronRight, Home } from "lucide-react";

export default function BookingSuccessPage() {
  // Mock data for the success screen (Frontend only)
  const bookingDetails = {
    orderId: "PS-" + Math.floor(100000 + Math.random() * 900000),
    turfName: "Spartan Box Cricket",
    date: "Thu, 30 Jul 2026",
    time: "19:00 - 21:00 (2 Hours)",
    location: "Sindhu Bhavan Road, Ahmedabad",
    amountPaid: 2440
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(11,28,48,0.08)] border border-[#eff4ff] relative overflow-hidden">
          
          {/* Decorative background blur */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#e5eeff] to-transparent opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Animated Checkmark */}
            <div className="w-20 h-20 bg-[#003ec7] rounded-full flex items-center justify-center mb-6 shadow-[0_8px_24px_rgba(0,62,199,0.25)] animate-bounce-short">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-black font-serif text-[#0b1c30] tracking-tight mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-[#434656] mb-8">
              Your turf is locked in. Get ready to play!
            </p>

            {/* Booking Details Box (Glassmorphism feel) */}
            <div className="w-full bg-[#f8f9ff] rounded-2xl p-5 border border-[#e5eeff] text-left mb-8 shadow-inner">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#d3e4fe]">
                <span className="text-[#737688] text-sm font-semibold uppercase">Order ID</span>
                <span className="text-[#0b1c30] font-bold font-mono">{bookingDetails.orderId}</span>
              </div>

              <h3 className="font-bold text-[#0b1c30] text-lg mb-4">{bookingDetails.turfName}</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#737688] text-xs font-semibold uppercase">Date</p>
                    <p className="text-[#0b1c30] font-medium">{bookingDetails.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#737688] text-xs font-semibold uppercase">Time</p>
                    <p className="text-[#0b1c30] font-medium">{bookingDetails.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#003ec7] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#737688] text-xs font-semibold uppercase">Location</p>
                    <p className="text-[#0b1c30] font-medium">{bookingDetails.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Paid */}
            <div className="w-full flex justify-between items-center mb-8 px-2">
              <span className="text-[#434656] font-medium">Total Paid</span>
              <span className="text-2xl font-extrabold text-[#003ec7]">₹{bookingDetails.amountPaid}</span>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <Link 
                href="/profile"
                className="w-full flex items-center justify-center gap-2 bg-[#003ec7] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#002f96] hover:shadow-lg transition-all"
              >
                View My Bookings
                <ChevronRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/choose-activity"
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