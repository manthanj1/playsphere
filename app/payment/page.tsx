"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
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

  // Razorpay script loaded via next/script in render

  const handlePay = async () => {
    if (!booking) return;
    setError(null);
    setIsSubmitting(true);

    try {
      let bookingPayload: any = {};
      if (booking.type === "turf" && booking.netId) {
        bookingPayload = {
          type: "turf",
          turfId: booking.itemId,
          netId: booking.netId,
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
                    netName: b.net?.name ?? booking.netName,
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
          ondismiss: function() {
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
      <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 border border-[#e5eeff] shadow-[0_12px_32px_rgba(11,28,48,0.08)] text-center max-w-md w-full">
          <p className="text-lg font-semibold text-[#434656] mb-4">No active booking was found.</p>
          <button
            onClick={() => router.push("/choose-activity")}
            className="inline-flex items-center gap-2 bg-[#003ec7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002f96] transition-colors"
          >
            Choose a turf or event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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

      <main className="max-w-[500px] mx-auto px-4 py-8">
        <div className="bg-white border border-[#e5eeff] rounded-3xl p-6 shadow-[0_12px_32px_rgba(11,28,48,0.06)]">
            <h3 className="font-bold text-[#0b1c30] text-lg mb-4">Order Summary</h3>

            <div className="mb-4 pb-4 border-b border-[#e5eeff]">
              <p className="font-bold text-[#0b1c30]">{booking.itemName}</p>
              <p className="text-sm text-[#434656] mt-1">
                {booking.date}{booking.slots?.length > 0 ? ` | ${booking.slots.join(", ")}` : booking.tierName}
              </p>
              {booking.netName && (
                <div className="inline-flex items-center gap-1.5 mt-2 bg-[#e5eeff] text-[#003ec7] text-xs font-semibold px-2.5 py-1 rounded-full">
                  {booking.areaType === "INDOOR" ? "🏠" : "☀️"} {booking.netName} — {booking.areaType === "INDOOR" ? "Indoor" : "Outdoor"}
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434656]">Booking Amount</span>
                <span className="font-semibold text-[#0b1c30]">₹{booking.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434656]">Platform Fee</span>
                <span className="font-semibold text-[#0b1c30]">₹{booking.platformFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-[#c3c5d9]">
              <span className="font-extrabold text-[#0b1c30] text-lg">Total</span>
              <span className="font-black text-2xl text-[#003ec7]">₹{booking.total}</span>
            </div>

            {error && <p className="text-sm text-[#e11d48] mb-4">{error}</p>}

            <button
              onClick={handlePay}
              disabled={isSubmitting}
              className="w-full bg-[#003ec7] text-white flex justify-between items-center px-6 py-4 rounded-xl font-bold hover:bg-[#002f96] hover:shadow-lg transition-all"
            >
              <span>{isSubmitting ? "Processing..." : `Pay ₹${booking.total}`}</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs text-[#737688] mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Secure Payment
            </p>
          </div>
      </main>
    </div>
  );
}
