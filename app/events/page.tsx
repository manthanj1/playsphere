"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Ticket,
  Filter,
  ChevronRight
} from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Tournaments", "Pickup Games", "Workshops"];

  // Mock Event Data localized for Gujarat
  const events = [
    {
      id: "e1",
      title: "Ahmedabad Box Cricket League 2026",
      category: "Tournaments",
      date: "Aug 15 - Aug 20, 2026",
      location: "Sindhu Bhavan Road, Ahmedabad",
      price: 1500,
      spotsLeft: 4,
      totalSpots: 16,
      imageColor: "from-blue-500 to-[#003ec7]"
    },
    {
      id: "e2",
      title: "Weekend Football Scrimmage",
      category: "Pickup Games",
      date: "Aug 02, 2026 • 07:00 AM",
      location: "Infocity, Gandhinagar",
      price: 200,
      spotsLeft: 12,
      totalSpots: 22,
      imageColor: "from-emerald-400 to-teal-600"
    },
    {
      id: "e3",
      title: "Beginner's Tennis Clinic",
      category: "Workshops",
      date: "Aug 05, 2026 • 05:00 PM",
      location: "Navrangpura, Ahmedabad",
      price: 800,
      spotsLeft: 8,
      totalSpots: 15,
      imageColor: "from-orange-400 to-rose-500"
    },
    {
      id: "e4",
      title: "Corporate Badminton Smash",
      category: "Tournaments",
      date: "Aug 10, 2026 • 09:00 AM",
      location: "SG Highway, Ahmedabad",
      price: 1000,
      spotsLeft: 2,
      totalSpots: 32,
      imageColor: "from-purple-500 to-indigo-600"
    }
  ];

  const filteredEvents = activeCategory === "All" 
    ? events 
    : events.filter(e => e.category === activeCategory);

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-12">
      
      {/* Header */}
      <header className="bg-white border-b border-[#e5eeff] sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1000px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#f8f9ff] rounded-full transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-[#434656]" />
            </button>
            <h1 className="text-2xl font-black font-serif text-[#0b1c30]">Discover Events</h1>
          </div>
          <button className="p-2 bg-[#e5eeff] text-[#003ec7] rounded-full hover:bg-[#d3e4fe] transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 mt-6">
        
        {/* Categories / Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#0b1c30] text-white shadow-md"
                  : "bg-white text-[#434656] border border-[#e5eeff] hover:border-[#003ec7] hover:text-[#003ec7]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#e5eeff] shadow-[0_12px_32px_rgba(11,28,48,0.04)] hover:shadow-[0_20px_40px_rgba(0,62,199,0.08)] transition-all duration-300 group flex flex-col"
            >
              {/* Event Image Placeholder (Gradient) */}
              <div className={`h-32 w-full bg-gradient-to-r ${event.imageColor} relative p-4 flex flex-col justify-between`}>
                <div className="self-end bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                  {event.category}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-extrabold text-xl text-[#0b1c30] mb-4 group-hover:text-[#003ec7] transition-colors line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-3 text-sm text-[#434656]">
                    <Calendar className="w-4 h-4 text-[#003ec7]" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#434656]">
                    <MapPin className="w-4 h-4 text-[#003ec7]" />
                    <span className="font-medium truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#434656]">
                    <Users className="w-4 h-4 text-[#003ec7]" />
                    <span className="font-medium">
                      <strong className="text-[#0b1c30]">{event.spotsLeft}</strong> spots left out of {event.totalSpots}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#e5eeff]">
                  <div>
                    <span className="text-xs text-[#737688] font-semibold uppercase block mb-1">Registration Fee</span>
                    <span className="text-xl font-black text-[#003ec7]">₹{event.price}</span>
                  </div>
                  <Link 
                    href="/payment"
                    className="flex items-center gap-2 bg-[#e5eeff] hover:bg-[#003ec7] text-[#003ec7] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300"
                  >
                    <Ticket className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Fallback */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e5eeff]">
            <Calendar className="w-12 h-12 text-[#c3c5d9] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0b1c30]">No events found</h3>
            <p className="text-[#737688]">There are no {activeCategory.toLowerCase()} scheduled right now.</p>
          </div>
        )}

      </main>
    </div>
  );
}