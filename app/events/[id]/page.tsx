"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import { fetchJson } from "@/lib/api";
import { saveCurrentBooking } from "@/lib/booking";

interface EventTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface BackendEvent {
  id: string;
  title: string;
  description?: string;
  category?: string;
  city?: string;
  date: string;
  location?: string;
  price?: number;
  host?: {
    name?: string;
  };
  tiers?: EventTier[];
}

const DEFAULT_TICKET_TIERS: EventTier[] = [
  { id: "standard", name: "Standard Admission", price: 499, features: ["Event entry", "Standard seating"] },
  { id: "vip", name: "VIP Experience", price: 1499, features: ["Priority entry", "VIP seating"] },
];
const imageColors = [
  "from-blue-500 to-indigo-700",
  "from-fuchsia-500 to-purple-700",
  "from-emerald-400 to-teal-600",
  "from-rose-500 to-pink-700",
  "from-orange-400 to-rose-600",
];

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [event, setEvent] = useState<BackendEvent | null>(null);
  const [eventTiers, setEventTiers] = useState<EventTier[]>(DEFAULT_TICKET_TIERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) {
        setError("Invalid event ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchJson(`/api/events/${eventId}`);
        const backendEvent: BackendEvent | null = response?.event ?? null;

        if (!backendEvent) {
          setError("Event not found.");
          return;
        }

        setEvent(backendEvent);
        setEventTiers(backendEvent.tiers ?? DEFAULT_TICKET_TIERS);
        setSelectedTier(backendEvent.tiers?.[0]?.id ?? DEFAULT_TICKET_TIERS[0].id);
        setError(null);
      } catch (error: any) {
        setError(error.message || "Failed to load event.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  const handleProceedToPayment = () => {
    if (!event || !selectedTier) return;
    const tier = eventTiers.find((tier) => tier.id === selectedTier);
    if (!tier) return;

    const bookingDate = new Date(event.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    saveCurrentBooking({
      type: "event",
      itemId: event.id,
      itemName: event.title,
      sportOrCategory: event.category ?? "Event",
      city: event.city ?? "Unknown",
      date: bookingDate,
      slots: [],
      tierId: tier.id,
      tierName: tier.name,
      amount: tier.price,
      platformFee: 40,
      total: tier.price + 40,
      location: event.location ?? event.city ?? "Unknown location",
    });

    router.push("/payment");
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center text-[#0b1c30] font-sans">
        <div className="w-16 h-16 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-4 text-[#0b1c30] font-sans">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-black">{error || "Event not found."}</h1>
        <button
          onClick={() => router.back()}
          className="mt-6 text-[#003ec7] font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const bookingDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-24">
      <Navbar showProfileIcon={true} />

      <PageContainer className="mt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#434656] hover:text-[#003ec7] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className={`w-full h-64 md:h-80 rounded-3xl bg-gradient-to-r ${imageColors[event.id.length % imageColors.length] || imageColors[0]} shadow-md`} />
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-serif text-[#0b1c30] mb-4">
                {event.title}
              </h1>

              <div className="flex flex-col gap-3 mb-6 bg-white p-5 rounded-2xl border border-[#e5eeff]">
                <div className="flex items-center gap-3 text-[#434656]">
                  <Calendar className="w-5 h-5 text-[#003ec7]" />
                  <span className="font-semibold text-lg">{bookingDate}</span>
                </div>
                <div className="flex items-center gap-3 text-[#434656]">
                  <MapPin className="w-5 h-5 text-[#003ec7]" />
                  <span className="font-semibold text-lg">{event.location ?? event.city ?? "Unknown location"}</span>
                </div>
                <div className="flex items-center gap-3 text-[#434656]">
                  <span className="font-semibold text-lg">Host:</span>
                  <span className="text-[#434656]">{event.host?.name ?? "Local host"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#003ec7]" />
                  About the Event
                </h3>
                <p className="text-[#434656] leading-relaxed text-lg">
                  {event.description ?? "No description available for this event yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#e5eeff] shadow-[0_12px_32px_rgba(11,28,48,0.04)] sticky top-24">
              <h2 className="text-2xl font-black text-[#0b1c30] mb-6">Select Tickets</h2>

              <div className="space-y-4 mb-8">
                {eventTiers.map((tier) => (
                  <label
                    key={tier.id}
                    className={`block cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300 ${
                      selectedTier === tier.id
                        ? "border-[#003ec7] bg-[#f0f4ff]"
                        : "border-[#e5eeff] hover:border-[#c3c5d9]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="ticket-tier"
                          value={tier.id}
                          checked={selectedTier === tier.id}
                          onChange={() => setSelectedTier(tier.id)}
                          className="w-5 h-5 text-[#003ec7] focus:ring-[#003ec7] mt-1"
                        />
                        <div>
                          <h4 className="font-bold text-[#0b1c30] text-lg">{tier.name}</h4>
                          <ul className="mt-2 space-y-1">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-[#434656] flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#003ec7]" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <span className="font-black text-xl text-[#0b1c30]">₹{tier.price}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!selectedTier}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedTier
                    ? "bg-[#003ec7] hover:bg-[#0052ff] text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                    : "bg-[#e5eeff] text-[#737688] cursor-not-allowed"
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
