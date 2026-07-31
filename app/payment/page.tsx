"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("upi");

  // Mock booking data passed from the previous screen
  const bookingSummary = {
    turfName: "Spartan Box Cricket",
    date: "Thu, 30 Jul 2026",
    time: "19:00 - 21:00",
    price: 2400,
    platformFee: 40,
    total: 2440
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-10">
      
      {/* Minimal Header */}
      <header className="bg-white border-b border-[#e5eeff] sticky top-0 z-50">
        <div className="max-w-[800px] mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-[#f8f9ff] rounded-full transition-colors -ml-2"
          >
            <ArrowLeft className="w-5 h-5 text-[#434656]" />
          </button>
          <h1 className="text-xl font-bold font-serif text-[#0b1c30]">Checkout</h1>
          <div className="w-9 h-9 flex items-center justify-center bg-[#e5eeff] rounded-full">
            <ShieldCheck className="w-5 h-5 text-[#003ec7]" />
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Payment Methods */}
        <div className="md:col-span-2 space-y-6">
          
          <h2 className="text-xl font-extrabold text-[#0b1c30]">Payment Method</h2>

          {/* UPI Section */}
          <div 
            onClick={() => setSelectedMethod("upi")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedMethod === "upi" 
              ? "border-[#003ec7] bg-[#f0f5ff] shadow-sm" 
              : "border-[#e5eeff] bg-white hover:border-[#c3c5d9]"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e5eeff] rounded-full flex items-center justify-center text-[#003ec7]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-[#0b1c30]">UPI</span>
              </div>
              {selectedMethod === "upi" && <CheckCircle2 className="w-6 h-6 text-[#003ec7]" />}
            </div>
            
            {selectedMethod === "upi" && (
              <div className="pl-14 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-3 gap-3">
                  {/* Mock UPI Apps */}
                  <div className="border border-[#c3c5d9] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-[#003ec7] transition-colors cursor-pointer bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">GPay</div>
                    <span className="text-xs font-semibold">Google Pay</span>
                  </div>
                  <div className="border border-[#c3c5d9] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-[#003ec7] transition-colors cursor-pointer bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">PhPe</div>
                    <span className="text-xs font-semibold">PhonePe</span>
                  </div>
                  <div className="border border-[#c3c5d9] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:bg-white hover:border-[#003ec7] transition-colors cursor-pointer bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700 text-xs">Paytm</div>
                    <span className="text-xs font-semibold">Paytm</span>
                  </div>
                </div>
                <div className="mt-4 relative">
                  <span className="text-xs text-[#737688] font-semibold uppercase absolute -top-2 left-3 bg-[#f0f5ff] px-1">Or enter UPI ID</span>
                  <input 
                    type="text" 
                    placeholder="example@okaxis" 
                    className="w-full border border-[#c3c5d9] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003ec7] focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Credit/Debit Card Section */}
          <div 
            onClick={() => setSelectedMethod("card")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedMethod === "card" 
              ? "border-[#003ec7] bg-[#f0f5ff] shadow-sm" 
              : "border-[#e5eeff] bg-white hover:border-[#c3c5d9]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e5eeff] rounded-full flex items-center justify-center text-[#003ec7]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-[#0b1c30]">Credit / Debit Card</span>
              </div>
              {selectedMethod === "card" && <CheckCircle2 className="w-6 h-6 text-[#003ec7]" />}
            </div>

            {selectedMethod === "card" && (
              <div className="pl-14 mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  className="w-full border border-[#c3c5d9] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003ec7]"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full border border-[#c3c5d9] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003ec7]"
                  />
                  <input 
                    type="text" 
                    placeholder="CVV" 
                    className="w-full border border-[#c3c5d9] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003ec7]"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Name on Card" 
                  className="w-full border border-[#c3c5d9] bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003ec7]"
                />
              </div>
            )}
          </div>

          {/* Net Banking Section */}
          <div 
            onClick={() => setSelectedMethod("netbanking")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedMethod === "netbanking" 
              ? "border-[#003ec7] bg-[#f0f5ff] shadow-sm" 
              : "border-[#e5eeff] bg-white hover:border-[#c3c5d9]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e5eeff] rounded-full flex items-center justify-center text-[#003ec7]">
                  <Building className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-[#0b1c30]">Net Banking</span>
              </div>
              {selectedMethod === "netbanking" && <CheckCircle2 className="w-6 h-6 text-[#003ec7]" />}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Pay Button */}
        <div className="md:col-span-1">
          <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 sticky top-24 shadow-[0_12px_32px_rgba(11,28,48,0.04)]">
            <h3 className="font-bold text-[#0b1c30] text-lg mb-4">Order Summary</h3>
            
            <div className="mb-4 pb-4 border-b border-[#e5eeff]">
              <p className="font-bold text-[#0b1c30]">{bookingSummary.turfName}</p>
              <p className="text-sm text-[#434656] mt-1">{bookingSummary.date} | {bookingSummary.time}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434656]">Booking Amount</span>
                <span className="font-semibold text-[#0b1c30]">₹{bookingSummary.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434656]">Platform Fee</span>
                <span className="font-semibold text-[#0b1c30]">₹{bookingSummary.platformFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-[#c3c5d9]">
              <span className="font-extrabold text-[#0b1c30] text-lg">Total</span>
              <span className="font-black text-2xl text-[#003ec7]">₹{bookingSummary.total}</span>
            </div>

            {/* This link acts as our mockup "Pay" action, routing to the success page */}
            <Link 
              href="/booking-success"
              className="w-full bg-[#003ec7] text-white flex justify-between items-center px-6 py-4 rounded-xl font-bold hover:bg-[#002f96] hover:shadow-lg transition-all"
            >
              <span>Pay ₹{bookingSummary.total}</span>
              <ChevronRight className="w-5 h-5" />
            </Link>

            <p className="text-center text-xs text-[#737688] mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Secure Payment
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}