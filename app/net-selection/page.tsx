"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  CloudRain,
  Check,
  Ban,
  AlertTriangle,
  ChevronRight,
  Home,
  Sun,
  ChevronDown,
} from "lucide-react";
import { getCurrentBooking, saveCurrentBooking, BookingSummary } from "@/lib/booking";
import { turfService, NetData, NetsApiResponse } from "@/services/turfService";
import Navbar from "@/components/Navbar";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TIME_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00",
  "23:00 - 00:00",
];

type NetStatus = "available" | "selected" | "rain-disabled" | "already-booked";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNetStatus(
  net: NetData,
  selectedNetId: string | null,
  isRainy: boolean,
  bookingDate: string | undefined
): NetStatus {
  if (net.id === selectedNetId) return "selected";
  if (net.areaType === "OUTDOOR" && isRainy) return "rain-disabled";

  const allSlotsBookedOrPassed = ALL_TIME_SLOTS.every((slot) => {
    if (net.bookedSlots.includes(slot)) return true;
    
    let isPassed = false;
    if (bookingDate) {
      const now = new Date();
      const slotStartTimeStr = slot.split(" - ")[0];
      const slotStartDate = new Date(`${bookingDate}T${slotStartTimeStr}:00`);
      const diff = slotStartDate.getTime() - now.getTime();
      isPassed = diff <= 3600000;
    }
    return isPassed;
  });

  if (allSlotsBookedOrPassed) return "already-booked";

  return "available";
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function NetCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-[#e5eeff] mb-3" />
      <div className="h-4 w-16 bg-[#e5eeff] rounded mb-2" />
      <div className="h-3 w-12 bg-[#f0f4ff] rounded" />
    </div>
  );
}

// ─── Net Card ─────────────────────────────────────────────────────────────────

interface NetCardProps {
  net: NetData;
  status: NetStatus;
  onClick: () => void;
}

function NetCard({ net, status, onClick }: NetCardProps) {
  const isDisabled = status === "rain-disabled" || status === "already-booked";
  const isSelected = status === "selected";

  const cardClass = [
    "relative rounded-2xl border-2 p-5 transition-all duration-200 flex flex-col gap-3",
    isSelected
      ? "border-[#003ec7] bg-[#003ec7] text-white shadow-lg shadow-[#003ec7]/25 scale-[1.02]"
      : isDisabled
      ? "border-[#dde3f0] bg-[#f4f6fb] text-[#aab0c8] cursor-not-allowed"
      : "border-[#e5eeff] bg-white text-[#0b1c30] hover:border-[#003ec7] hover:shadow-md cursor-pointer",
  ].join(" ");

  const iconBgClass = isSelected
    ? "bg-white/20"
    : isDisabled
    ? "bg-[#eaecf5]"
    : "bg-[#e5eeff]";

  const iconColorClass = isSelected
    ? "text-white"
    : isDisabled
    ? "text-[#b0b8d4]"
    : "text-[#003ec7]";

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-label={`${net.name} – ${status}`}
      id={`net-card-${net.id}`}
      className={cardClass}
      style={{ pointerEvents: isDisabled ? "none" : undefined }}
    >
      {/* Status icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass}`}>
        {isSelected ? (
          <Check className={`w-5 h-5 ${iconColorClass}`} />
        ) : status === "rain-disabled" ? (
          <CloudRain className={`w-5 h-5 ${iconColorClass}`} />
        ) : net.areaType === "INDOOR" ? (
          <Home className={`w-5 h-5 ${iconColorClass}`} />
        ) : (
          <Sun className={`w-5 h-5 ${iconColorClass}`} />
        )}
      </div>

      {/* Net name */}
      <div>
        <p className={`font-bold text-base leading-tight ${isSelected ? "text-white" : ""}`}>
          {net.name}
        </p>
        <p className={`text-xs font-medium mt-0.5 ${isSelected ? "text-blue-100" : "text-[#737688]"}`}>
          {net.areaType === "INDOOR" ? "Indoor" : "Outdoor"}
        </p>
      </div>

      {/* Status badges */}
      {status === "rain-disabled" && (
        <span className="absolute top-3 right-3 bg-[#e0e7f5] text-[#6b7faa] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Blocked
        </span>
      )}
      {status === "already-booked" && (
        <span className="absolute top-3 right-3 bg-[#fdf6f6] text-[#c4a4a4] border border-[#f0dede] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Booked
        </span>
      )}
      {isSelected && (
        <span className="absolute top-3 right-3 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Selected
        </span>
      )}
    </button>
  );
}

// ─── Slot Button ──────────────────────────────────────────────────────────────

interface SlotButtonProps {
  slot: string;
  isSelected: boolean;
  isBooked: boolean;
  isPassed: boolean;
  onClick: () => void;
}

function SlotButton({ slot, isSelected, isBooked, isPassed, onClick }: SlotButtonProps) {
  if (isBooked) {
    return (
      <div className="relative py-2.5 px-2 text-sm font-semibold rounded-lg border bg-[#fdf6f6] border-[#f0dede] text-[#c4a4a4] cursor-not-allowed flex items-center justify-center">
        {slot}
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fee2e2] text-[#b91c1c] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
          Booked
        </span>
      </div>
    );
  }

  if (isPassed) {
    return (
      <div className="relative py-2.5 px-2 text-sm font-semibold rounded-lg border bg-[#f4f6fb] border-[#e2e8f0] text-[#aab0c8] cursor-not-allowed flex items-center justify-center">
        {slot}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`py-2.5 px-2 text-sm font-semibold rounded-lg border transition-all ${
        isSelected
          ? "bg-[#e5eeff] border-[#003ec7] text-[#003ec7] shadow-sm"
          : "bg-white border-[#c3c5d9] text-[#434656] hover:border-[#003ec7] hover:text-[#003ec7]"
      }`}
    >
      {slot}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NetSelectionPage() {
  const router = useRouter();
  const slotPanelRef = useRef<HTMLDivElement>(null);

  const demoRain =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("rain") === "1"
      : false;

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [nets, setNets] = useState<NetData[]>([]);
  const [isRainy, setIsRainy] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loadingNets, setLoadingNets] = useState(true);
  const [netError, setNetError] = useState<string | null>(null);

  // Step state machine: "pick_net" → "pick_slots"
  const [step, setStep] = useState<"pick_net" | "pick_slots">("pick_net");
  const [selectedNetId, setSelectedNetId] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const effectiveIsRainy = isRainy || demoRain;

  // ── Load booking from localStorage ──────────────────────────────────────────
  useEffect(() => {
    const current = getCurrentBooking();
    if (!current || current.type !== "turf") {
      router.replace("/choose-activity");
      return;
    }
    setBooking(current);
  }, [router]);

  // ── Fetch nets once booking is loaded ───────────────────────────────────────
  useEffect(() => {
    if (!booking) return;

    async function loadNets() {
      setLoadingNets(true);
      setNetError(null);
      try {
        const data: NetsApiResponse = await turfService.getTurfNets(
          booking!.itemId,
          booking!.bookingDate ?? ""
        );
        setNets(data.nets ?? []);
        setIsRainy(data.isRainy ?? false);
        setTemperature(data.temperature ?? null);
      } catch (err: any) {
        setNetError(err.message || "Unable to load nets. Please try again.");
      } finally {
        setLoadingNets(false);
      }
    }

    loadNets();
  }, [booking]);

  // ── When rainy, deselect any outdoor net and reset to net-picking step ───────
  useEffect(() => {
    if (!effectiveIsRainy || !selectedNetId) return;
    const selected = nets.find((n) => n.id === selectedNetId);
    if (selected?.areaType === "OUTDOOR") {
      setSelectedNetId(null);
      setSelectedSlots([]);
      setStep("pick_net");
    }
  }, [effectiveIsRainy, nets, selectedNetId]);

  // ── Scroll slot panel into view when it appears ──────────────────────────────
  useEffect(() => {
    if (step === "pick_slots" && slotPanelRef.current) {
      setTimeout(() => {
        slotPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [step]);

  const handleNetClick = (net: NetData) => {
    if (net.id === selectedNetId) {
      // Deselect — go back to net picking step
      setSelectedNetId(null);
      setSelectedSlots([]);
      setStep("pick_net");
      return;
    }
    setSelectedNetId(net.id);
    setSelectedSlots([]);
    setStep("pick_slots");
    setBookingError(null);
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleProceed = () => {
    if (!booking || !selectedNetId || selectedSlots.length === 0) return;

    const selectedNet = nets.find((n) => n.id === selectedNetId);
    if (!selectedNet) return;

    setBookingError(null);

    if (selectedNet.areaType === "OUTDOOR" && effectiveIsRainy) {
      setBookingError(
        "Outdoor nets are blocked due to rainy conditions. Please choose an indoor net."
      );
      return;
    }

    const amount = selectedSlots.length * booking.amount; // booking.amount = price per hour
    const platformFee = 40;
    const total = amount + platformFee;

    const updatedBooking: BookingSummary = {
      ...booking,
      netId: selectedNetId,
      netName: selectedNet.name,
      netIds: [selectedNetId],
      netNames: [selectedNet.name],
      areaType: selectedNet.areaType,
      slots: selectedSlots,
      amount,
      platformFee,
      total,
    };

    saveCurrentBooking(updatedBooking);
    router.push("/payment");
  };

  // ─── Derived data ──────────────────────────────────────────────────────────
  const indoorNets = nets.filter((n) => n.areaType === "INDOOR");
  const outdoorNets = nets.filter((n) => n.areaType === "OUTDOOR");
  const selectedNet = nets.find((n) => n.id === selectedNetId) ?? null;

  const canProceed =
    selectedNetId !== null &&
    selectedSlots.length > 0 &&
    !(selectedNet?.areaType === "OUTDOOR" && effectiveIsRainy);

  const totalPrice = selectedSlots.length * (booking?.amount ?? 0);

  // ─── Loading guard ─────────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8f9ff] min-h-screen font-sans antialiased text-[#0b1c30]">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-4 md:px-10 py-6 pb-40 md:pb-12">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-6"
          id="back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Turf Details
        </button>

        {/* ── Step Progress ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-0 mb-6">
          {[
            { label: "Date", done: true },
            { label: "Select Net", done: step === "pick_slots" },
            { label: "Time Slots", done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    s.done || (i === 0)
                      ? "bg-[#003ec7] text-white"
                      : i === 1 && step === "pick_net"
                      ? "bg-[#003ec7] text-white"
                      : i === 2 && step === "pick_slots"
                      ? "bg-[#003ec7] text-white"
                      : "bg-[#e5eeff] text-[#737688]"
                  }`}
                >
                  {(s.done && i < (step === "pick_slots" ? 1 : 0)) ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    (i === 1 && step === "pick_net") || (i === 2 && step === "pick_slots") || i === 0
                      ? "text-[#0b1c30]"
                      : "text-[#737688]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 2 && <ChevronRight className="w-4 h-4 text-[#c3c5d9] mx-2" />}
            </div>
          ))}
        </div>

        {/* ── Booking Summary Banner ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#003ec7] to-[#1a56e0] rounded-2xl p-5 md:p-7 mb-6 text-white shadow-xl shadow-[#003ec7]/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">
                Selected Turf
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold font-serif leading-tight">
                {booking.itemName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-blue-100 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {booking.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {booking.date}
                </span>
                {selectedNet && (
                  <span className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    {selectedNet.name}
                  </span>
                )}
                {selectedSlots.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} selected
                  </span>
                )}
              </div>
            </div>

            {/* Weather chip */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-right min-w-[120px]">
              {loadingNets ? (
                <div className="h-6 w-20 bg-white/20 rounded animate-pulse mx-auto" />
              ) : (
                <>
                  <div className="flex items-center justify-end gap-1.5 text-white font-bold text-lg">
                    {effectiveIsRainy ? (
                      <CloudRain className="w-5 h-5 text-sky-200" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-200" />
                    )}
                    {temperature != null ? `${temperature.toFixed(1)}°C` : demoRain ? "22.5°C" : "--"}
                  </div>
                  <p className="text-blue-200 text-xs mt-0.5">
                    {effectiveIsRainy ? "Rainy" : "Clear"}
                    {demoRain && !isRainy && " (demo)"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Rain Alert Banner ──────────────────────────────────────────────── */}
        {!loadingNets && effectiveIsRainy && (
          <div
            id="rain-alert-banner"
            className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm mb-0.5">Rainy Weather Detected</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Outdoor nets are automatically blocked due to live rainy weather conditions. Please
                choose an indoor net for your session.
              </p>
            </div>
          </div>
        )}

        {/* ── Net Error ──────────────────────────────────────────────────────── */}
        {netError && !loadingNets && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6">
            <Ban className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">{netError}</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 1: NET SELECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-10">

          {/* ── Indoor Nets ──────────────────────────────────────────────────── */}
          <section id="indoor-nets-section">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center">
                <Home className="w-5 h-5 text-[#003ec7]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0b1c30] font-serif">Indoor Area</h2>
                <p className="text-[#737688] text-sm">Climate-controlled, always available</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {loadingNets
                ? Array.from({ length: 3 }).map((_, i) => <NetCardSkeleton key={i} />)
                : indoorNets.map((net) => (
                    <NetCard
                      key={net.id}
                      net={net}
                      status={getNetStatus(net, selectedNetId, effectiveIsRainy, booking?.bookingDate)}
                      onClick={() => handleNetClick(net)}
                    />
                  ))}
            </div>
          </section>

          {/* ── Outdoor Nets ─────────────────────────────────────────────────── */}
          <section
            id="outdoor-nets-section"
            className={effectiveIsRainy ? "opacity-60" : ""}
            style={{ pointerEvents: effectiveIsRainy ? "none" : undefined }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  effectiveIsRainy ? "bg-[#eaecf5]" : "bg-[#fff7e6]"
                }`}
              >
                {effectiveIsRainy ? (
                  <CloudRain className="w-5 h-5 text-[#8a95b5]" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0b1c30] font-serif flex items-center gap-2">
                  Outdoor Area
                  {effectiveIsRainy && (
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide">
                      Blocked — Rain
                    </span>
                  )}
                </h2>
                <p className="text-[#737688] text-sm">
                  {effectiveIsRainy
                    ? "Unavailable due to live rainy conditions"
                    : "Open-air nets with natural light"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {loadingNets
                ? Array.from({ length: 3 }).map((_, i) => <NetCardSkeleton key={i} />)
                : outdoorNets.map((net) => (
                    <NetCard
                      key={net.id}
                      net={net}
                      status={getNetStatus(net, selectedNetId, effectiveIsRainy, booking?.bookingDate)}
                      onClick={() => handleNetClick(net)}
                    />
                  ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              STEP 2: TIME SLOT SELECTION (appears after a net is selected)
          ══════════════════════════════════════════════════════════════════ */}
          {step === "pick_slots" && selectedNet && (
            <section
              id="slot-selection-section"
              ref={slotPanelRef}
              className="bg-white border border-[#c3c5d9] rounded-2xl p-6 shadow-[0_4px_20px_rgba(11,28,48,0.06)] animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003ec7] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0b1c30] font-serif">
                      Available Slots
                    </h2>
                    <p className="text-[#737688] text-sm">
                      For <span className="font-semibold text-[#003ec7]">{selectedNet.name}</span>{" "}
                      on {booking.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedNetId(null); setSelectedSlots([]); setStep("pick_net"); }}
                  className="text-xs text-[#737688] hover:text-[#003ec7] font-semibold underline"
                >
                  Change Net
                </button>
              </div>

              {/* Rainy outdoor net guard */}
              {selectedNet.areaType === "OUTDOOR" && effectiveIsRainy ? (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-sm font-medium">
                    This outdoor net is blocked due to rainy weather. Please go back and select an
                    indoor net.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {ALL_TIME_SLOTS.map((slot) => {
                      const isBooked = selectedNet.bookedSlots.includes(slot);
                      const isSelected = selectedSlots.includes(slot);

                      let isPassed = false;
                      if (booking?.bookingDate) {
                        const now = new Date();
                        const slotStartTimeStr = slot.split(" - ")[0];
                        const slotStartDate = new Date(`${booking.bookingDate}T${slotStartTimeStr}:00`);
                        
                        // Block if current time is less than or equal to 1 hour (3600000 ms) before the slot starts.
                        const diff = slotStartDate.getTime() - now.getTime();
                        isPassed = diff <= 3600000;
                      }

                      return (
                        <SlotButton
                          key={slot}
                          slot={slot}
                          isSelected={isSelected}
                          isBooked={isBooked}
                          isPassed={isPassed}
                          onClick={() => !isBooked && !isPassed && toggleSlot(slot)}
                        />
                      );
                    })}
                  </div>

                  {/* Pricing summary */}
                  {selectedSlots.length > 0 && (
                    <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#e5eeff] mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#434656] font-medium text-sm">
                          {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} × ₹{booking.amount}
                        </span>
                        <span className="text-[#0b1c30] font-bold">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#434656] font-medium text-sm">Platform Fee</span>
                        <span className="text-[#0b1c30] font-bold">₹40</span>
                      </div>
                      <div className="border-t border-[#c3c5d9] pt-2 mt-2 flex justify-between items-center">
                        <span className="text-[#0b1c30] font-bold">Total</span>
                        <span className="text-[#003ec7] font-extrabold text-xl">₹{totalPrice + 40}</span>
                      </div>
                    </div>
                  )}

                  {/* Hint when no slots selected */}
                  {selectedSlots.length === 0 && (
                    <p className="text-center text-[#737688] text-sm mb-4">
                      Select one or more available time slots above
                    </p>
                  )}
                </>
              )}
            </section>
          )}

          {/* Prompt to select a net */}
          {step === "pick_net" && !loadingNets && nets.length > 0 && (
            <div className="flex items-center gap-3 bg-[#f0f4ff] border border-[#d3e4fe] rounded-2xl px-5 py-4">
              <ChevronDown className="w-5 h-5 text-[#003ec7] shrink-0" />
              <p className="text-[#434656] text-sm font-medium">
                Select a net above to view and choose your available time slots.
              </p>
            </div>
          )}

        </div>

        {/* ── Booking error ──────────────────────────────────────────────────── */}
        {bookingError && (
          <div
            id="booking-error-banner"
            className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mt-6"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">{bookingError}</p>
          </div>
        )}
      </main>

      {/* ── Sticky Bottom Bar ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-[#e5eeff] shadow-[0_-8px_32px_rgba(11,28,48,0.08)] z-50">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between gap-4">
          {/* Left: selection summary */}
          <div className="flex items-center gap-3">
            {canProceed ? (
              <>
                <div className="w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#003ec7]" />
                </div>
                <div>
                  <p className="font-bold text-[#0b1c30] text-sm">{selectedNet?.name}</p>
                  <p className="text-[#737688] text-xs">
                    {selectedSlots.length} slot{selectedSlots.length !== 1 ? "s" : ""} · ₹{totalPrice + 40}
                  </p>
                </div>
              </>
            ) : step === "pick_net" ? (
              <p className="text-[#737688] text-sm font-medium">Select a net to continue</p>
            ) : (
              <p className="text-[#737688] text-sm font-medium">Select at least one time slot</p>
            )}
          </div>

          {/* Right: Proceed button */}
          <button
            id="proceed-to-payment-btn"
            onClick={handleProceed}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
              canProceed
                ? "bg-[#003ec7] text-white hover:bg-[#002f96] hover:shadow-lg hover:shadow-[#003ec7]/30 transform hover:-translate-y-0.5"
                : "bg-[#e5eeff] text-[#737688] cursor-not-allowed"
            }`}
          >
            {canProceed ? "Proceed to Payment" : step === "pick_net" ? "Select a Net" : "Select Time Slots"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
