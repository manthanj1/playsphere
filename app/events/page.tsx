"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Ticket,
  Filter,
  Search,
  Music,
  ArrowLeft
} from "lucide-react";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SectionHeader from "@/components/SectionHeader";
import SearchInput from "@/components/SearchInput";

export default function EntertainmentEventsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCity, setActiveCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Navratri", "Concerts", "Comedy", "Cultural"];
  const cities = ["All", "Ahmedabad", "Surat", "Jamnagar", "Gandhinagar", "Vadodara"];

  // Mock Event Data featuring varied events and explicit city tags
  const events = [
    {
      id: "ev-navratri-01",
      title: "Jamnagar Grand Navratri Mahotsav 2026",
      category: "Navratri",
      date: "Oct 15 - Oct 24, 2026",
      location: "Reliance Greens, Jamnagar",
      city: "Jamnagar",
      startingPrice: 1200,
      imageColor: "from-fuchsia-500 to-purple-700"
    },
    {
      id: "ev-concert-02",
      title: "Arijit Singh Live Symphony",
      category: "Concerts",
      date: "Aug 28, 2026 • 07:30 PM",
      location: "Narendra Modi Stadium, Ahmedabad",
      city: "Ahmedabad",
      startingPrice: 2500,
      imageColor: "from-blue-500 to-indigo-700"
    },
    {
      id: "ev-comedy-03",
      title: "Gujarati Standup Special",
      category: "Comedy",
      date: "Aug 12, 2026 • 09:00 PM",
      location: "Town Hall, Gandhinagar",
      city: "Gandhinagar",
      startingPrice: 499,
      imageColor: "from-emerald-400 to-teal-600"
    },
    {
      id: "ev-navratri-04",
      title: "Surat Diamond City Garba",
      category: "Navratri",
      date: "Oct 16 - Oct 24, 2026",
      location: "Sarsana Convention Centre, Surat",
      city: "Surat",
      startingPrice: 1500,
      imageColor: "from-rose-500 to-pink-700"
    },
    {
      id: "ev-culture-05",
      title: "Saurashtra Heritage Fair",
      category: "Cultural",
      date: "Sep 05, 2026 • 10:00 AM",
      location: "Mela Ground, Surendranagar",
      city: "Ahmedabad", // Grouped near Ahmedabad for demo purposes
      startingPrice: 150,
      imageColor: "from-orange-400 to-rose-600"
    }
  ];

  const filteredEvents = events.filter((e) => {
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    const matchesCity = activeCity === "All" || e.city === activeCity;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-12">
      <Navbar showProfileIcon={true} />

      <PageContainer className="mt-6 md:mt-8">
        
        {/* Back Navigation to Choose Activity */}
        <Link 
          href="/choose-activity"
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </Link>

        <SectionHeader 
          title="Explore Local Events"
          subtitle="Book tickets for Navratri, live concerts, and exclusive local shows."
          actions={
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              
              {/* City Dropdown */}
              <div className="relative w-full md:w-auto">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737688]" />
                <select
                  value={activeCity}
                  onChange={(e) => setActiveCity(e.target.value)}
                  className="w-full md:w-40 pl-9 pr-8 py-2.5 bg-white border border-[#c3c5d9] rounded-xl text-sm font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#003ec7] focus:border-[#003ec7] appearance-none cursor-pointer"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city === "All" ? "All Cities" : city}</option>
                  ))}
                </select>
              </div>

              <SearchInput 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search events..."
                icon={Search}
                className="flex-grow w-full md:w-64"
              />
            </div>
          }
        />

        {/* Categories / Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#e5eeff] shadow-[0_12px_32px_rgba(11,28,48,0.04)] hover:shadow-[0_20px_40px_rgba(0,62,199,0.08)] transition-all duration-300 flex flex-col group"
            >
              <div className={`h-40 w-full bg-gradient-to-r ${event.imageColor} relative p-4 flex flex-col justify-between`}>
                <div className="self-end bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {event.category}
                </div>
                <Music className="w-10 h-10 text-white/40 absolute bottom-4 left-4" />
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
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#e5eeff]">
                  <div>
                    <span className="text-xs text-[#737688] font-semibold uppercase block mb-1">Starting From</span>
                    <span className="text-xl font-black text-[#003ec7]">₹{event.startingPrice}</span>
                  </div>
                  <Link 
                    href={`/events/${event.id}`}
                    className="flex items-center gap-2 bg-[#e5eeff] hover:bg-[#003ec7] text-[#003ec7] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300"
                  >
                    <Ticket className="w-4 h-4" />
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Fallback */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e5eeff] mt-6">
            <Calendar className="w-12 h-12 text-[#c3c5d9] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0b1c30]">No events found</h3>
            <p className="text-[#737688]">We couldn't find any events matching your selected city and category.</p>
          </div>
        )}

      </PageContainer>
    </div>
  );
}