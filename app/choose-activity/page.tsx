"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Trophy, 
  PartyPopper, 
  User, 
  ArrowRight,
  ArrowLeft,
  MapPin 
} from "lucide-react";

function ChooseActivityContent() {
  const searchParams = useSearchParams();
  const cityQuery = searchParams.get("city");
  const cityName = cityQuery 
    ? cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1) 
    : "Your City";

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-sans overflow-x-hidden antialiased">
      
      {/* TopAppBar */}
      <header className="fixed w-full top-0 z-50 bg-[#f8f9ff] shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1280px] mx-auto relative">
          
          {/* Left: Logo (Changed to span to disable navigation) */}
          <span className="text-3xl md:text-4xl italic font-black font-serif text-[#003ec7] tracking-tighter cursor-default select-none">
            PlaySphere
          </span>
          
          {/* Center: Selected City (Hidden on mobile to avoid duplication with bottom bar) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-1.5 px-4 py-1.5 bg-[#e5eeff] text-[#003ec7] rounded-full border border-[#d3e4fe] shadow-sm">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">
              City - {cityName}
            </span>
          </div>

          {/* Right: Clickable Standard Profile Icon linking to /profile */}
          <Link 
            href="/profile" 
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#003ec7] bg-[#e5eeff] text-[#003ec7] hover:bg-[#d3e4fe] transition-colors shadow-sm hover:scale-105 active:scale-95"
            aria-label="Go to profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-[88px] pb-[80px] md:pb-12 bg-gradient-to-br from-[#003ec7]/5 to-[#dae2fd]/40 min-h-screen flex flex-col relative">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#0052ff]/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#dae2fd]/50 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 pt-6 pb-16 relative z-10 flex flex-col flex-grow">
          
          {/* Back Button (Top Left) */}
          <div className="mb-4 md:mb-8 self-start">
            <Link 
              href="/select-city" 
              className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cities
            </Link>
          </div>

          {/* Centered Content Wrapper */}
          <div className="flex flex-col items-center justify-center w-full flex-grow">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#0b1c30] mb-4">
                Choose Your Arena in {cityName}
              </h1>
              <p className="text-lg text-[#434656] max-w-2xl mx-auto">
                Select your path to discover high-energy local sports leagues or electrifying community events. The action starts here.
              </p>
            </div>

            {/* Bento Grid Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
              
              {/* Sports Card */}
              <Link 
                href={`/sports?city=${cityQuery || 'default'}`}
                className="group relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] transition-all duration-300 cursor-pointer h-[400px] md:h-[500px] block"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="Sports Action" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/90 via-[#0b1c30]/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-end">
                  <div className="w-16 h-16 bg-[#003ec7] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                    <Trophy className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-white mb-2">Sports</h2>
                  <p className="text-base text-[#dce9ff] mb-6 opacity-90">
                    Find local cricket leagues, kabaddi matches, and top-tier facilities. Get on the field.
                  </p>
                  <div className="self-start px-6 py-3 bg-[#003ec7] text-white text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2 group-hover:bg-[#0052ff] group-hover:text-[#dfe3ff] transition-colors">
                    Explore Sports
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Events Card */}
              <Link 
                href={`/events?city=${cityQuery || 'default'}`}
                className="group relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] transition-all duration-300 cursor-pointer h-[400px] md:h-[500px] block"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="Events Festival" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1lzPUeoLzAzufEiPWBN3p57DBavzejiCBfT8oTaHePcOLnZ-Gx00jm0OE8ENwF1uxAYxrFLB8L0ihvLpuC53MWl_72jxxVd24gAuZE4mLRiImYmeMpCVJ1EE5yuKofwYJcKclQeXc9kDR_7S8t3kV-o-C70QVHmiGK3Cyh0EyKvyZCa4crX2TPU8VEsPApjBJC9YEv56ktMS_XvrXal9Db_SchuwsoQp9MAQXHu4z8rgRB9BB7xcS1Q"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/90 via-[#0b1c30]/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-end">
                  <div className="w-16 h-16 bg-[#a94900] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                    <PartyPopper className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-white mb-2">Events</h2>
                  <p className="text-base text-[#dce9ff] mb-6 opacity-90">
                    Discover electrifying Navratri nights, community festivals, and exclusive gatherings.
                  </p>
                  <div className="self-start px-6 py-3 bg-[#a94900] text-white text-sm font-semibold tracking-wide rounded-lg flex items-center gap-2 group-hover:bg-[#833700] group-hover:text-white transition-colors">
                    Explore Events
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

            </div>

            {/* Quick Stats */}
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center w-full">
              <div className="p-4">
                <div className="text-3xl font-bold font-serif text-[#003ec7] mb-1">500+</div>
                <div className="text-xs font-medium text-[#434656] uppercase tracking-wider">Active Leagues</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold font-serif text-[#003ec7] mb-1">12k</div>
                <div className="text-xs font-medium text-[#434656] uppercase tracking-wider">Weekly Players</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold font-serif text-[#003ec7] mb-1">300+</div>
                <div className="text-xs font-medium text-[#434656] uppercase tracking-wider">Live Events</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold font-serif text-[#003ec7] mb-1">24/7</div>
                <div className="text-xs font-medium text-[#434656] uppercase tracking-wider">Booking Access</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Mobile Bar - Displaying City Name Only */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-4 py-4 bg-[#f8f9ff] border-t border-[#c3c5d9] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <div className="flex items-center gap-2 px-6 py-2 bg-[#e5eeff] text-[#003ec7] rounded-full border border-[#d3e4fe] shadow-sm">
          <MapPin className="w-5 h-5" />
          <span className="text-base font-semibold tracking-wide">
            City - {cityName}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChooseActivityPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8f9ff] text-[#003ec7]">
        <div className="w-8 h-8 border-4 border-[#003ec7] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold">Loading Arena...</p>
      </div>
    }>
      <ChooseActivityContent />
    </Suspense>
  );
}