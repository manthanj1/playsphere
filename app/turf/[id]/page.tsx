"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchJson } from "@/lib/api";
import { saveCurrentBooking } from "@/lib/booking";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Car,
  Droplets,
  Lightbulb,
  ShieldCheck,
  Coffee,
  Share2,
  Heart,
  AlertCircle,
} from "lucide-react";

interface TurfItem {
  id: number;
  name: string;
  city: string;
  location: string;
  sport: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  availability: string;
  description: string;
  amenities: string[];
}

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

const timeSlots = [
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00",
  "23:00 - 00:00",
];

export default function TurfDetailPage() {
  const router = useRouter();
  const params = useParams();
  const turfId = params?.id;
  const [turfDetail, setTurfDetail] = useState<TurfItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

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
        const response = await fetchJson(`/api/turfs/${turfId}`);
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

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

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

  const handleChooseNet = () => {
    if (!turfDetail || selectedSlots.length === 0) return;

    const amount = selectedSlots.length * turfDetail.price;
    const platformFee = 40;
    const total = amount + platformFee;

    saveCurrentBooking({
      type: "turf",
      itemId: turfDetail.id.toString(),
      itemName: turfDetail.name,
      sportOrCategory: turfDetail.sport,
      city: turfDetail.city,
      date: selectedDateString ?? "",
      bookingDate: rawBookingDate,
      slots: selectedSlots,
      amount,
      platformFee,
      total,
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

  const totalPrice = selectedSlots.length * turfDetail.price;

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

        <div className="w-full h-[30vh] md:h-[50vh] rounded-2xl md:rounded-3xl overflow-hidden relative mb-8 shadow-sm group">
          <img
            src={turfDetail.image}
            alt={turfDetail.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 bg-[#003ec7] text-white px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
            {turfDetail.sport}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b1c30] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#e11d48] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#0b1c30] leading-tight">
                  {turfDetail.name}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[#434656] text-base mb-4 mt-2">
                <div className="flex items-center gap-1.5 bg-[#e5eeff] text-[#003ec7] px-3 py-1 rounded-lg font-semibold">
                  <Star className="w-4 h-4 fill-[#003ec7]" />
                  {turfDetail.rating} ({turfDetail.reviews} reviews)
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-[#003ec7]" />
                  {turfDetail.location}, {turfDetail.city}
                </div>
              </div>
            </div>

            <hr className="border-[#c3c5d9]" />

            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-4">About this Arena</h2>
              <p className="text-[#434656] text-lg leading-relaxed">
                {turfDetail.description}
              </p>
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
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#c3c5d9] rounded-2xl p-6 shadow-[0_12px_32px_rgba(11,28,48,0.08)]">
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-[#eff4ff]">
                <div>
                  <span className="text-sm font-semibold text-[#737688] uppercase tracking-wide block mb-1">Price per hour</span>
                  <div className="text-3xl font-extrabold text-[#0b1c30]">
                    ₹{turfDetail.price}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#003ec7] font-semibold bg-[#e5eeff] px-2 py-1 rounded">
                  <Clock className="w-4 h-4" /> Open 24/7
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-[#0b1c30] mb-3">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(index)}
                      className={`flex flex-col items-center justify-center min-w-[72px] p-3 rounded-xl border transition-all ${
                        selectedDate === index
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

              <div className="mb-8">
                <h3 className="font-bold text-[#0b1c30] mb-3">Available Slots (Evening)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`py-2.5 px-2 text-sm font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? "bg-[#e5eeff] border-[#003ec7] text-[#003ec7]"
                            : "bg-white border-[#c3c5d9] text-[#434656] hover:border-[#003ec7] hover:text-[#003ec7]"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSlots.length > 0 && (
                <div className="bg-[#f8f9ff] p-4 rounded-xl mb-6 border border-[#e5eeff]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium">Selected Slots ({selectedSlots.length})</span>
                    <span className="text-[#0b1c30] font-bold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium">Platform Fee</span>
                    <span className="text-[#0b1c30] font-bold">₹40</span>
                  </div>
                  <div className="border-t border-[#c3c5d9] pt-2 mt-2 flex justify-between items-center">
                    <span className="text-[#0b1c30] font-bold text-lg">Total</span>
                    <span className="text-[#003ec7] font-extrabold text-xl">₹{totalPrice + 40}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleChooseNet}
                disabled={selectedSlots.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedSlots.length > 0
                    ? "bg-[#003ec7] text-white hover:bg-[#002f96] hover:shadow-lg transform hover:-translate-y-1"
                    : "bg-[#e5eeff] text-[#737688] cursor-not-allowed"
                }`}
              >
                {selectedSlots.length > 0 ? "Choose a Net →" : "Select a Time Slot"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
