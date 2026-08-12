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
  Minus,
  Plus,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import { eventService } from "@/services/eventService";
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
  image?: string;
}

const DEFAULT_TICKET_TIERS: EventTier[] = [
  { id: "standard", name: "Standard Admission", price: 499, features: ["Event entry", "Standard seating"] },
  { id: "vip", name: "VIP Experience", price: 1499, features: ["Priority entry", "VIP seating"] },
];
const TABS = ["About", "Tickets", "Host"];

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
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
        const response = await eventService.getEventById(eventId as string);
        const backendEvent: any = response?.event ?? null;

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

    const amount = tier.price * quantity;
    const platformFee = 40;
    const total = amount + platformFee;

    const bookingPayload = {
      type: "event" as const,
      itemId: event.id,
      itemName: event.title,
      sportOrCategory: event.category ?? "Event",
      city: event.city ?? "Unknown",
      date: new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      bookingDate: new Date(event.date).toISOString().split("T")[0],
      slots: [], // Events may not have time slots in the same way
      tierId: tier.id,
      tierName: tier.name,
      quantity,
      amount,
      platformFee,
      total,
      location: event.location ?? event.city ?? "Unknown",
    };

    saveCurrentBooking(bookingPayload);

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
            <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-md">
              <img 
                src={event.image || `/images/placeholders/image-${8 + parseInt(event.id.split('-')[1] || "1")}.jpg?v=3`} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-serif text-[#0b1c30] mb-4">
                {event.title}
              </h1>

              <div className="flex flex-col gap-6 mb-6 bg-white p-6 rounded-2xl border border-[#e5eeff]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-[#434656]">
                    <Calendar className="w-5 h-5 text-[#003ec7]" />
                    <span className="font-semibold text-lg">{bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#434656]">
                    <MapPin className="w-5 h-5 text-[#003ec7]" />
                    <span className="font-semibold text-lg">{event.location ?? event.city ?? "Unknown location"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#434656]">
                    <User className="w-5 h-5 text-[#003ec7]" />
                    <span className="font-semibold text-lg">{event.host?.name ?? "PlaySphere Admin"}</span>
                  </div>
                </div>

                <div className="h-px w-full bg-[#e5eeff]" />

                <div className="space-y-3">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-[#0b1c30]">
                    <Info className="w-5 h-5 text-[#003ec7]" />
                    About the Event
                  </h3>
                  <p className="text-[#434656] leading-relaxed text-base md:text-lg">
                    {event.description ?? "No description available for this event yet."}
                  </p>
                </div>
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

              {/* Quantity Selector */}
              <div className="mb-8 flex items-center justify-between bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                <div>
                  <h4 className="font-bold text-[#0b1c30] text-lg">Number of Persons</h4>
                  <p className="text-sm text-[#434656]">Max 10 tickets per booking</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-[#c3c5d9]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1 rounded-full text-[#434656] hover:bg-[#f0f4ff] hover:text-[#003ec7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-xl text-[#0b1c30] w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="p-1 rounded-full text-[#434656] hover:bg-[#f0f4ff] hover:text-[#003ec7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-6 flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  Cancellations and refunds are not allowed for this event booking. Please confirm your details before proceeding.
                </p>
              </div>

              {selectedTier && (
                <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#e5eeff] mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium text-sm">
                      {quantity} Ticket{quantity !== 1 ? "s" : ""} × ₹{eventTiers.find(t => t.id === selectedTier)?.price || 0}
                    </span>
                    <span className="text-[#0b1c30] font-bold">
                      ₹{(eventTiers.find(t => t.id === selectedTier)?.price || 0) * quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium text-sm">Platform Fee</span>
                    <span className="text-[#0b1c30] font-bold">₹40</span>
                  </div>
                  <div className="border-t border-[#c3c5d9] pt-2 mt-2 flex justify-between items-center">
                    <span className="text-[#0b1c30] font-bold">Total Amount</span>
                    <span className="text-[#003ec7] font-extrabold text-xl">
                      ₹{(eventTiers.find(t => t.id === selectedTier)?.price || 0) * quantity + 40}
                    </span>
                  </div>
                </div>
              )}

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
