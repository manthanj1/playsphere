"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { getCurrentBooking, saveConfirmedBooking, clearCurrentBooking, BookingSummary } from "@/lib/booking";
import { paymentService } from "@/services/paymentService";

export default function PaymentPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const current = getCurrentBooking();
    if (!current) {
      setError("No booking found. Please select a turf or event first.");
      return;
    }
    setBooking(current);
  }, []);

  const handlePay = async () => {
    if (!booking) return;
    setError(null);
    setIsSubmitting(true);

    try {
      let bookingPayload: any = {};
      if (booking.type === "turf" && (booking.netIds?.length > 0 || booking.netId)) {
        bookingPayload = {
          type: "turf",
          turfId: booking.itemId,
          netId: booking.netIds ? booking.netIds[0] : booking.netId,
          areaType: booking.areaType,
          bookingDate: booking.bookingDate,
          timeslots: booking.slots,
          amount: booking.amount,
          platformFee: booking.platformFee,
          total: booking.total,
        };
      } else {
        bookingPayload = {
          type: "event",
          eventId: booking.itemId,
          bookingDate: booking.bookingDate || booking.date,
          amount: booking.amount,
          platformFee: booking.platformFee,
          total: booking.total,
        };
      }

      const createRes = await paymentService.createOrder(booking.total);

      if (!createRes?.order?.id) {
        setError("Unable to initialize payment gateway.");
        setIsSubmitting(false);
        return;
      }

      const storedUser = localStorage.getItem("playSphereUser");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummykey123",
        amount: createRes.order.amount,
        currency: "INR",
        name: "PlaySphere",
        description: `Booking for ${booking.itemName}`,
        order_id: createRes.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes?.success) {
              const bookingRes = await paymentService.createBooking(bookingPayload);

              if (!bookingRes?.booking) {
                setError("Payment successful but booking failed. Please contact support.");
                setIsSubmitting(false);
                return;
              }

              const b = bookingRes.booking;
              let confirmed: BookingSummary;
              if (b.type === 'turf') {
                confirmed = {
                  bookingId: b.id,
                  type: "turf",
                  itemId: String(b.turfId),
                  itemName: b.turf?.name ?? booking.itemName,
                  sportOrCategory: b.turf?.sport ?? booking.sportOrCategory,
                  city: b.turf?.city ?? booking.city,
                  date: booking.date,
                  bookingDate: booking.bookingDate,
                  slots: (b.slots ?? []).map((s: any) => s.timeslot),
                  amount: b.amount,
                  platformFee: b.platformFee,
                  total: b.total,
                  location: booking.location,
                  netId: b.netId,
                  netName: b.net?.name ?? (booking.netNames ? booking.netNames.join(", ") : booking.netName),
                  areaType: b.areaType ?? booking.areaType,
                  createdAt: b.createdAt,
                };
              } else {
                confirmed = {
                  bookingId: b.id,
                  type: "event",
                  itemId: String(b.eventId),
                  itemName: booking.itemName,
                  sportOrCategory: booking.sportOrCategory || "Event",
                  city: booking.city || "",
                  date: booking.date,
                  slots: [],
                  amount: b.amount,
                  platformFee: b.platformFee,
                  total: b.total,
                  location: booking.location,
                  createdAt: b.createdAt,
                };
              }

              saveConfirmedBooking(confirmed);
              clearCurrentBooking();
              router.push("/booking-success");
            } else {
              setError("Payment verification failed.");
              setIsSubmitting(false);
            }
          } catch (err: any) {
            setError(err.message || "Something went wrong during payment verification.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: parsedUser?.name || "Guest",
          email: parsedUser?.email || "",
        },
        theme: {
          color: "#003ec7"
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description || "Payment failed");
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      if (err.message?.toLowerCase().includes("no longer available") ||
        err.message?.toLowerCase().includes("slot")) {
        setError("This slot is no longer available — another user just booked it. Please go back and choose a different net or time.");
      } else {
        setError(err.message || "Payment initialization failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen text-[#0b1c30] font-sans antialiased flex items-center justify-center p-6">
        <div className="bg-white rounded-[2rem] p-8 border border-[#e5eeff] shadow-[0_20px_60px_rgba(11,28,48,0.05)] text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#003ec7]" />
          <p className="text-lg font-medium text-[#434656] mb-6">No active booking was found.</p>
          <button
            onClick={() => router.push("/choose-activity")}
            className="inline-flex items-center justify-center gap-2 w-full bg-[#003ec7] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#002f96] hover:shadow-lg hover:shadow-[#003ec7]/30 transition-all duration-300"
          >
            Choose a turf or event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen text-[#0b1c30] font-sans antialiased pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[#e5eeff] sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Booking
            </button>
          <h1 className="text-xl font-bold font-serif text-[#0b1c30] tracking-tight">Complete Payment</h1>
          <div className="w-10 h-10 flex items-center justify-center bg-[#f0f4ff] rounded-full">
            <ShieldCheck className="w-5 h-5 text-[#003ec7]" />
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-10 md:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Branding & Trust */}
          <div className="flex flex-col justify-center lg:pr-8">
            <div className="inline-block mb-4 px-3 py-1 bg-[#e5eeff] text-[#003ec7] text-sm font-bold uppercase tracking-wider rounded-full self-start">
              Final Step
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold font-serif text-[#0b1c30] leading-tight mb-6">
              You're almost on the pitch!
            </h2>
            <p className="text-[#434656] text-lg lg:text-xl mb-12 leading-relaxed">
              Review your details and complete your payment to secure your spot. We guarantee a seamless experience with zero hidden fees.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[#e5eeff] text-[#003ec7] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[#0b1c30] font-bold text-xl mb-1">Instant Confirmation</h3>
                  <p className="text-[#737688] text-base leading-relaxed">Your booking is secured the moment your payment goes through.</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[#0b1c30] font-bold text-xl mb-1">100% Secure Payment</h3>
                  <p className="text-[#737688] text-base leading-relaxed">We use industry-standard encryption. Your details are never stored.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[#0b1c30] font-bold text-xl mb-1">Quick & Easy</h3>
                  <p className="text-[#737688] text-base leading-relaxed">Checkout in seconds. Spend more time playing and less time booking.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Card */}
          <div className="relative">
            {/* Background ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#003ec7]/10 blur-[100px] -z-10 rounded-full" />

            <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_rgba(11,28,48,0.08)] relative overflow-hidden ring-1 ring-black/[0.02]">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4ff] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#003ec7]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#737688] text-sm uppercase tracking-wider">Order Summary</h3>
              <h2 className="font-extrabold text-[#0b1c30] text-xl leading-tight">{booking.itemName}</h2>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-[#f8f9ff] rounded-2xl p-5 mb-8 border border-[#e5eeff]">
            <div className="space-y-4">
              
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-[#003ec7] shrink-0 opacity-80" />
                <div>
                  <p className="text-xs font-semibold text-[#737688] uppercase tracking-wider mb-0.5">Date</p>
                  <p className="font-medium text-[#0b1c30]">{booking.date}</p>
                </div>
              </div>

              {(booking.slots?.length > 0 || booking.tierName) && (
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-[#003ec7] shrink-0 opacity-80" />
                  <div>
                    <p className="text-xs font-semibold text-[#737688] uppercase tracking-wider mb-0.5">
                      {booking.slots?.length > 0 ? "Time Slots" : "Ticket Tier"}
                    </p>
                    <p className="font-medium text-[#0b1c30]">
                      {booking.slots?.length > 0 ? booking.slots.join(", ") : booking.tierName}
                    </p>
                  </div>
                </div>
              )}

              {booking.netName && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#003ec7] shrink-0 opacity-80" />
                  <div>
                    <p className="text-xs font-semibold text-[#737688] uppercase tracking-wider mb-0.5">Net Selection</p>
                    <div className="inline-flex items-center gap-1.5 mt-0.5 bg-white border border-[#e5eeff] text-[#0b1c30] text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      {booking.areaType === "INDOOR" ? "🏠" : "☀️"} {booking.netName}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#434656] font-medium">Booking Amount</span>
              <span className="font-bold text-[#0b1c30]">₹{booking.amount}</span>
            </div>
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#434656] font-medium">Platform Fee</span>
              <span className="font-bold text-[#0b1c30]">₹{booking.platformFee}</span>
            </div>
          </div>

          {/* Total Block */}
          <div className="bg-gradient-to-br from-[#003ec7] to-[#1a56e0] rounded-2xl p-5 mb-8 flex justify-between items-center text-white shadow-xl shadow-[#003ec7]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl translate-x-10 -translate-y-10" />
            <div className="relative z-10">
              <span className="text-blue-100 font-medium text-sm block mb-1">Total Amount Payable</span>
              <span className="font-black text-3xl tracking-tight">₹{booking.total}</span>
            </div>
            <CreditCard className="w-8 h-8 text-white/80 relative z-10" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePay}
            disabled={isSubmitting}
            className="w-full bg-[#003ec7] text-white flex justify-between items-center px-6 py-4 rounded-2xl font-bold text-lg hover:bg-[#002f96] hover:shadow-[0_8px_24px_rgba(0,62,199,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:transform-none disabled:hover:shadow-none"
          >
            <span>{isSubmitting ? "Processing Securely..." : `Pay ₹${booking.total}`}</span>
            <ChevronRight className={`w-6 h-6 ${isSubmitting ? 'animate-pulse' : ''}`} />
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 text-[#737688]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p className="text-xs font-medium uppercase tracking-wider">Payments are 100% secure & encrypted</p>
          </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
