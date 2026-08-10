"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  CloudSun,
  Zap,
  Shield,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  Menu,
  X,
  Check,
} from "lucide-react";

// ─── Floating orb component ───────────────────────────────────────────────────
function Orb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-[120px] opacity-30 pointer-events-none ${className}`}
    />
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${gradient}`}
      >
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-black text-white mb-1 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </div>
  );
}

// ─── Mock booking UI (hero visual) ───────────────────────────────────────────
function BookingMockup() {
  const slots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];
  const booked = [1, 3];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/40 to-cyan-600/20 rounded-3xl blur-3xl scale-110" />

      {/* Main card */}
      <div className="relative rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-2xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
              PlaySphere
            </p>
            <h4 className="text-white font-bold text-lg leading-tight">
              Skyline Cricket Turf
            </h4>
            <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              Ahmedabad, Gujarat
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full px-3 py-1.5 text-xs font-bold">
            <CloudSun className="w-3.5 h-3.5" />
            Clear · 29°C
          </div>
        </div>

        {/* Date selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
            <button
              key={d}
              className={`flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                i === 2
                  ? "bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-[10px] opacity-70 mb-0.5">{d}</span>
              {7 + i}
            </button>
          ))}
        </div>

        {/* Slot grid */}
        <div>
          <p className="text-slate-400 text-xs font-medium mb-2.5 uppercase tracking-widest">
            Time Slots
          </p>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s, i) => {
              const isBooked = booked.includes(i);
              const isSelected = i === 4;
              return (
                <button
                  key={s}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                      : isBooked
                      ? "bg-red-500/10 text-red-400/50 border border-red-500/10 cursor-not-allowed line-through"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:bg-violet-500/15 hover:border-violet-400/40 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Net selection preview */}
        <div className="flex gap-2">
          {["Net A", "Net B", "Net C"].map((n, i) => (
            <div
              key={n}
              className={`flex-1 rounded-xl py-2 text-center text-xs font-semibold transition-all ${
                i === 2
                  ? "bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-violet-300 border border-violet-500/30"
                  : "bg-white/5 text-slate-400 border border-white/10"
              }`}
            >
              <span className="block text-[10px] text-slate-500 mb-0.5">
                {i === 0 ? "Indoor" : i === 1 ? "Indoor" : "Outdoor"}
              </span>
              {n}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl py-3 text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
          Confirm Booking · ₹480
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating badge: Weather alert */}
      <div className="absolute -top-4 -right-4 bg-amber-500/20 border border-amber-500/30 backdrop-blur-md rounded-2xl px-3 py-2 text-xs font-semibold text-amber-300 flex items-center gap-2 shadow-xl animate-bounce-slow">
        <span className="text-base">🌦️</span> Rain? Nets auto-locked
      </div>

      {/* Floating badge: Booked */}
      <div className="absolute -bottom-4 -left-4 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md rounded-2xl px-3 py-2 text-xs font-semibold text-emerald-300 flex items-center gap-2 shadow-xl">
        <Check className="w-3.5 h-3.5" /> Booking confirmed!
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden font-sans antialiased">

      {/* ── Background noise/grid ──────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* orbs */}
        <Orb className="w-[600px] h-[600px] bg-violet-600 top-[-200px] left-[-100px]" />
        <Orb className="w-[500px] h-[500px] bg-cyan-500 bottom-[-100px] right-[-100px]" />
        <Orb className="w-[300px] h-[300px] bg-violet-800 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ── Sticky Nav ────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/8 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            id="nav-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/40 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              PlaySphere
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              id="nav-login-btn"
              className="text-slate-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/8 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              id="nav-signup-btn"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/30 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/8 transition-all"
            id="mobile-menu-btn"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/8 px-4 py-4 space-y-2">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="block text-slate-300 hover:text-white text-sm font-medium py-2.5 px-3 rounded-xl hover:bg-white/8 transition-all"
              >
                {item}
              </a>
            ))}
            <div className="pt-2 space-y-2 border-t border-white/8 mt-2">
              <Link
                href="/login"
                className="block text-center text-slate-300 text-sm font-semibold py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/8 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block text-center bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl hover:opacity-90 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Now with Live Weather Blocking
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                <span className="text-white">Book Your</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Cricket Net
                </span>
                <br />
                <span className="text-white">In Seconds.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
              PlaySphere gives you instant access to top-rated turfs in your
              city — pick a slot, choose your net, pay, and play. No calls, no
              waiting, no double-bookings.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/signup"
                id="hero-get-started-btn"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-base px-7 py-4 rounded-2xl hover:opacity-90 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                id="hero-features-btn"
                className="inline-flex items-center gap-2 border border-white/15 text-slate-200 font-bold text-base px-7 py-4 rounded-2xl hover:bg-white/8 hover:border-white/25 transition-all hover:-translate-y-0.5"
              >
                See Features
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🏏", "⚽", "🎾", "🏐"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-900 flex items-center justify-center text-base shadow-lg"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-xs">
                  Loved by <span className="text-white font-semibold">2,400+</span> athletes
                </p>
              </div>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="relative hidden md:block">
            <BookingMockup />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/8 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50+" label="Premium Turfs" />
            <StatCard value="12k+" label="Bookings Made" />
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value="0" label="Double Bookings" />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-violet-400 text-xs font-bold uppercase tracking-widest border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 rounded-full">
              Everything you need
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Built for serious players
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Every feature was designed to eliminate friction between you and
              your next match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Calendar className="w-6 h-6 text-violet-300" />}
              title="Real-time Slot Booking"
              description="See live availability and lock your preferred time slot instantly. No more back-and-forth calls with the turf manager."
              gradient="bg-gradient-to-br from-violet-600/20 to-violet-800/20 border border-violet-500/20"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-cyan-300" />}
              title="Zero Double-Bookings"
              description="Transactional locks at the database level guarantee no two players ever book the same slot on the same net."
              gradient="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/20"
            />
            <FeatureCard
              icon={<CloudSun className="w-6 h-6 text-amber-300" />}
              title="Live Weather Blocking"
              description="Outdoor nets are automatically locked when rain is detected via live weather APIs. Only book what you can actually play on."
              gradient="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/20"
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6 text-emerald-300" />}
              title="City-based Discovery"
              description="Find the closest premium turfs in your city with ratings, pricing, and sport filters built in."
              gradient="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/20"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-pink-300" />}
              title="Team Events"
              description="Host and discover local sports events. Rally your team or join pickup matches organized by other players."
              gradient="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/20"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-violet-300" />}
              title="Instant Confirmation"
              description="Get a booking confirmation the moment you pay. All slots, nets, dates, and cost breakdowns in one clean view."
              gradient="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-28 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 rounded-full">
              Simple as 1-2-3
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              From signup to playing in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/40 to-violet-500/40" />

            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up in under 60 seconds. No credit card required to browse turfs.",
                color: "from-violet-600 to-violet-700",
                glow: "shadow-violet-500/30",
              },
              {
                step: "02",
                title: "Pick a turf & slot",
                desc: "Browse turfs near you, check live availability, choose your net and time slots.",
                color: "from-purple-600 to-cyan-600",
                glow: "shadow-cyan-500/30",
              },
              {
                step: "03",
                title: "Play & enjoy!",
                desc: "Pay securely and get an instant confirmation. Your slot is locked — show up and play.",
                color: "from-cyan-600 to-cyan-700",
                glow: "shadow-cyan-500/30",
              },
            ].map(({ step, title, desc, color, glow }) => (
              <div key={step} className="relative text-center space-y-4 group">
                <div className="relative inline-block">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl font-black text-white mx-auto shadow-xl ${glow} group-hover:scale-110 transition-transform`}
                  >
                    {step}
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-white/10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-purple-900/50 to-cyan-600/20" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            {/* Orbs inside card */}
            <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-violet-500 blur-[100px] opacity-25" />
            <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-cyan-500 blur-[100px] opacity-20" />

            <div className="relative z-10 text-center px-8 py-16 md:py-20 space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Ready to play?
                <br />
                <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Your perfect slot is waiting.
                </span>
              </h2>
              <p className="text-slate-300 text-lg max-w-lg mx-auto">
                Join thousands of athletes who've already ditched the phone
                calls and booking hassles.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/signup"
                  id="cta-get-started-btn"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-base px-8 py-4 rounded-2xl hover:opacity-90 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  id="cta-signin-btn"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-white/8 hover:border-white/30 transition-all hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/8 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-white tracking-tight">PlaySphere</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 PlaySphere. Built for athletes, by athletes.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Custom animations ─────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}