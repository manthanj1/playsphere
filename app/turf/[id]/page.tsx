"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { turfService, TurfItem } from "@/services/turfService";
import { saveCurrentBooking } from "@/lib/booking";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Car,
  Droplets,
  Lightbulb,
  ShieldCheck,
  Coffee,
  AlertCircle,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push({
      date: nextDate,
      dayName: i === 0 ? "Today" : nextDate.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: nextDate.getDate(),
      month: nextDate.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return dates;
};

export default function TurfDetailPage() {
  const router = useRouter();
  const params = useParams();
  const turfId = params?.id;
  const [turfDetail, setTurfDetail] = useState<TurfItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);

  const dates = generateDates();

  useEffect(() => {
    async function loadTurf() {
      if (!turfId) {
        setLoadError("Invalid turf selection.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await turfService.getTurfById(turfId as string);
        setTurfDetail(response?.turf ?? null);
        setLoadError(null);
      } catch (error: any) {
        setLoadError(error.message || "Unable to load turf details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTurf();
  }, [turfId]);

  const selectedDateObj = dates[selectedDate]?.date;

  const selectedDateString = selectedDateObj?.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Raw YYYY-MM-DD in local time — used by the backend availability query
  const rawBookingDate = selectedDateObj
    ? `${selectedDateObj.getFullYear()}-${String(selectedDateObj.getMonth() + 1).padStart(2, "0")}-${String(selectedDateObj.getDate()).padStart(2, "0")}`
    : "";

  const handleContinue = () => {
    if (!turfDetail) return;

    // Save booking state with empty slots — slots are chosen after net selection
    saveCurrentBooking({
      type: "turf",
      itemId: turfDetail.id.toString(),
      itemName: turfDetail.name,
      sportOrCategory: turfDetail.sport,
      city: turfDetail.city,
      date: selectedDateString ?? "",
      bookingDate: rawBookingDate,
      slots: [],
      amount: turfDetail.price, // per-hour price; will be multiplied by slot count later
      platformFee: 40,
      total: turfDetail.price + 40,
      location: `${turfDetail.location}, ${turfDetail.city}`,
    });

    router.push("/net-selection");
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center text-[#0b1c30] font-sans">
        <div className="w-16 h-16 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (loadError || !turfDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff] text-[#0b1c30] p-6">
        <AlertCircle className="w-12 h-12 text-[#e11d48] mb-4" />
        <h1 className="text-2xl font-bold font-serif mb-2">Unable to load turf</h1>
        <p className="text-[#434656] mb-6">{loadError || "The turf could not be found."}</p>
        <button onClick={() => router.back()} className="text-[#003ec7] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans antialiased pb-20 md:pb-0">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 md:py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        {/* Cover Image */}
        <div className="w-full h-64 md:h-[400px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden relative mb-8 shadow-sm group">
          <img
            src={turfDetail.image}
            alt={turfDetail.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 bg-[#003ec7] text-white px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
            {turfDetail.sport}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Left: Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#0b1c30] leading-tight mb-3">
                {turfDetail.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[#434656] text-base">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-[#003ec7]" />
                  {turfDetail.location}, {turfDetail.city}
                </div>
              </div>
            </div>

            <hr className="border-[#c3c5d9]" />

            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-4">About this Arena</h2>
              <p className="text-[#434656] text-lg leading-relaxed">{turfDetail.description}</p>
            </section>

            <hr className="border-[#c3c5d9]" />

            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Car, label: "Free Parking" },
                  { icon: Droplets, label: "RO Water" },
                  { icon: Lightbulb, label: "LED Floodlights" },
                  { icon: ShieldCheck, label: "First Aid Kit" },
                  { icon: Coffee, label: "Cafeteria" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#0b1c30] bg-white border border-[#c3c5d9] p-4 rounded-xl shadow-sm hover:border-[#003ec7] transition-colors">
                    <div className="w-10 h-10 bg-[#e5eeff] rounded-full flex items-center justify-center text-[#003ec7] shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-[#c3c5d9]" />

            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-2">Location</h2>
              <p className="text-[#434656] text-base mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#003ec7]" />
                {turfDetail.location}, {turfDetail.city}
              </p>
              <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-[#c3c5d9] shadow-[0_4px_20px_rgba(11,28,48,0.05)]">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(turfDetail.name + ', ' + turfDetail.location + ', ' + turfDetail.city)}&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${turfDetail.name} Location`}
                ></iframe>
              </div>
            </section>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#c3c5d9] rounded-2xl p-6 shadow-[0_12px_32px_rgba(11,28,48,0.08)]">

              {/* Price + Hours */}
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-[#eff4ff]">
                <div>
                  <span className="text-sm font-semibold text-[#737688] uppercase tracking-wide block mb-1">Price per hour</span>
                  <div className="text-3xl font-extrabold text-[#0b1c30]">₹{turfDetail.price}</div>
                </div>
                <div className="flex items-center gap-1 text-[#003ec7] font-semibold bg-[#e5eeff] px-2 py-1 rounded">
                  <Clock className="w-4 h-4" /> Open 24/7
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#003ec7] text-white text-xs font-bold shrink-0">1</div>
                <span className="text-sm font-bold text-[#0b1c30]">Select a Date</span>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e5eeff] text-[#737688] text-xs font-bold shrink-0 ml-auto">2</div>
                <span className="text-sm text-[#737688]">Pick Net & Slots</span>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-[#003ec7]" />
                  <h3 className="font-bold text-[#0b1c30]">Select Date</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(index)}
                      className={`flex flex-col items-center justify-center min-w-[72px] p-3 rounded-xl border transition-all ${selectedDate === index
                          ? "bg-[#003ec7] border-[#003ec7] text-white shadow-md transform -translate-y-1"
                          : "bg-white border-[#c3c5d9] text-[#434656] hover:border-[#003ec7]"
                        }`}
                    >
                      <span className={`text-xs font-semibold uppercase ${selectedDate === index ? "text-[#dce9ff]" : "text-[#737688]"}`}>
                        {item.month}
                      </span>
                      <span className="text-xl font-bold my-0.5">{item.dayNumber}</span>
                      <span className={`text-xs ${selectedDate === index ? "text-white" : "text-[#0b1c30]"}`}>
                        {item.dayName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-6 flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  Cancellations and refunds are not allowed for turf bookings. Please confirm your date before proceeding.
                </p>
              </div>

              {/* CTA */}
              <button
                id="continue-to-net-btn"
                onClick={handleContinue}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-[#003ec7] text-white hover:bg-[#002f96] hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Continue to Net Selection
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
