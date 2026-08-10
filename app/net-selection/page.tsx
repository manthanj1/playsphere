"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { getCurrentBooking, saveCurrentBooking, BookingSummary } from "@/lib/booking";
import { fetchJson } from "@/lib/api";
import Navbar from "@/components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NetData {
  id: string;
  name: string;
  areaType: "INDOOR" | "OUTDOOR";
  bookedSlots: string[];
}

interface NetsApiResponse {
  nets: NetData[];
  isRainy: boolean;
  weatherCode: number | null;
  temperature: number | null;
}

type NetStatus = "available" | "selected" | "rain-disabled" | "already-booked";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNetStatus(
  net: NetData,
  selectedNetId: string | null,
  isRainy: boolean,
  userSlots: string[]
): NetStatus {
  if (net.id === selectedNetId) return "selected";
  if (net.areaType === "OUTDOOR" && isRainy) return "rain-disabled";
  const hasConflict = userSlots.some((s) => net.bookedSlots.includes(s));
  if (hasConflict) return "already-booked";
  return "available";
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────

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
      : status === "rain-disabled"
      ? "border-[#dde3f0] bg-[#f4f6fb] text-[#aab0c8] cursor-not-allowed"
      : status === "already-booked"
      ? "border-[#f0dede] bg-[#fdf6f6] text-[#c4a4a4] cursor-not-allowed"
      : "border-[#e5eeff] bg-white text-[#0b1c30] hover:border-[#003ec7] hover:shadow-md cursor-pointer",
  ].join(" ");

  const iconBgClass = isSelected
    ? "bg-white/20"
    : status === "rain-disabled" || status === "already-booked"
    ? "bg-[#eaecf5]"
    : "bg-[#e5eeff]";

  const iconColorClass = isSelected
    ? "text-white"
    : status === "rain-disabled" || status === "already-booked"
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
        ) : status === "already-booked" ? (
          <Ban className={`w-5 h-5 ${iconColorClass}`} />
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
        <p
          className={`text-xs font-medium mt-0.5 ${
            isSelected ? "text-blue-100" : "text-[#737688]"
          }`}
        >
          {net.areaType === "INDOOR" ? "Indoor" : "Outdoor"}
        </p>
      </div>

      {/* Status badge */}
      {status === "already-booked" && (
        <span className="absolute top-3 right-3 bg-[#fee2e2] text-[#b91c1c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Booked
        </span>
      )}
      {status === "rain-disabled" && (
        <span className="absolute top-3 right-3 bg-[#e0e7f5] text-[#6b7faa] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Blocked
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NetSelectionPage() {
  const router = useRouter();

  // ── Demo override: append ?rain=1 to the URL to simulate rainy weather ───────
  // e.g. http://localhost:3000/net-selection?rain=1
  const demoRain = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("rain") === "1" : false;

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [nets, setNets] = useState<NetData[]>([]);
  const [isRainy, setIsRainy] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [selectedNetId, setSelectedNetId] = useState<string | null>(null);
  const [loadingNets, setLoadingNets] = useState(true);
  const [netError, setNetError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Merge live API weather with the optional demo override
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

    const turfId = booking.itemId;
    const date = booking.bookingDate ?? "";

    async function loadNets() {
      setLoadingNets(true);
      setNetError(null);
      try {
        const data: NetsApiResponse = await fetchJson(
          `/api/turfs/${turfId}/nets${date ? `?date=${encodeURIComponent(date)}` : ""}`
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

  // ── Deselect outdoor net if it turns rainy ──────────────────────────────────
  useEffect(() => {
    if (!effectiveIsRainy || !selectedNetId) return;
    const net = nets.find((n) => n.id === selectedNetId);
    if (net?.areaType === "OUTDOOR") setSelectedNetId(null);
  }, [effectiveIsRainy, nets, selectedNetId]);

  // ── Proceed ─────────────────────────────────────────────────────────────────
  const handleProceed = () => {
    if (!booking || !selectedNetId) return;
    const selectedNet = nets.find((n) => n.id === selectedNetId);
    if (!selectedNet) return;

    setBookingError(null);

    // If outdoor net and it just became rainy, block silently
    if (selectedNet.areaType === "OUTDOOR" && effectiveIsRainy) {
      setBookingError("Outdoor nets are blocked due to rainy conditions. Please choose an indoor net.");
      return;
    }

    const updatedBooking: BookingSummary = {
      ...booking,
      netId: selectedNet.id,
      netName: selectedNet.name,
      areaType: selectedNet.areaType,
    };

    saveCurrentBooking(updatedBooking);
    router.push("/payment");
  };

  // ─── Split nets by area type ─────────────────────────────────────────────
  const indoorNets = nets.filter((n) => n.areaType === "INDOOR");
  const outdoorNets = nets.filter((n) => n.areaType === "OUTDOOR");

  const selectedNet = nets.find((n) => n.id === selectedNetId) ?? null;
  const canProceed =
    selectedNetId !== null &&
    selectedNet !== null &&
    !(selectedNet.areaType === "OUTDOOR" && effectiveIsRainy);

  // ─── Loading state ───────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8f9ff] min-h-screen font-sans antialiased text-[#0b1c30]">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-4 md:px-10 py-6 pb-32 md:pb-10">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-6"
          id="back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Turf Details
        </button>

        {/* ── Booking Summary Banner ─────────────────────────────────────── */}
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
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {booking.slots.length} slot{booking.slots.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {booking.slots.map((slot) => (
                  <span
                    key={slot}
                    className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20"
                  >
                    {slot}
                  </span>
                ))}
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

        {/* ── Rain Alert Banner ──────────────────────────────────────────── */}
        {!loadingNets && effectiveIsRainy && (
          <div
            id="rain-alert-banner"
            className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300"
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

        {/* ── Net Error ─────────────────────────────────────────────────── */}
        {netError && !loadingNets && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6">
            <Ban className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm font-medium">{netError}</p>
          </div>
        )}

        <div className="space-y-10">

          {/* ── Indoor Nets Section ─────────────────────────────────────── */}
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
                      status={getNetStatus(net, selectedNetId, effectiveIsRainy, booking.slots)}
                      onClick={() => setSelectedNetId(net.id)}
                    />
                  ))}
            </div>
          </section>

          {/* ── Outdoor Nets Section ────────────────────────────────────── */}
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
                      status={getNetStatus(net, selectedNetId, effectiveIsRainy, booking.slots)}
                      onClick={() => setSelectedNetId(net.id)}
                    />
                  ))}
            </div>
          </section>
        </div>

        {/* ── Booking error ───────────────────────────────────────────────── */}
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

      {/* ── Sticky Bottom Bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-[#e5eeff] shadow-[0_-8px_32px_rgba(11,28,48,0.08)] z-50">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between gap-4">
          {/* Selected net preview */}
          <div className="flex items-center gap-3">
            {selectedNet ? (
              <>
                <div className="w-10 h-10 rounded-full bg-[#e5eeff] flex items-center justify-center shrink-0">
                  {selectedNet.areaType === "INDOOR" ? (
                    <Home className="w-5 h-5 text-[#003ec7]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[#003ec7]" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#0b1c30] text-sm">{selectedNet.name}</p>
                  <p className="text-[#737688] text-xs">{selectedNet.areaType === "INDOOR" ? "Indoor" : "Outdoor"} Net</p>
                </div>
              </>
            ) : (
              <p className="text-[#737688] text-sm font-medium">
                No net selected yet
              </p>
            )}
          </div>

          {/* Price + Proceed */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-[#737688] font-medium">Total</p>
              <p className="font-extrabold text-[#003ec7] text-xl">₹{booking.total}</p>
            </div>
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
              {canProceed ? "Proceed to Payment" : "Select a Net"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
