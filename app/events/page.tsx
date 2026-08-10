"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar,
  MapPin,
  Ticket,
  Search,
  Music,
  ArrowLeft
} from "lucide-react";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SectionHeader from "@/components/SectionHeader";
import SearchInput from "@/components/SearchInput";
import { fetchJson } from "@/lib/api";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  city: string;
  date: string;
  location: string;
  category: string;
  startingPrice: number;
  imageColor: string;
  hostName?: string;
}

interface BackendEventItem {
  id: string;
  title: string;
  description?: string;
  city?: string;
  date: string;
  host?: {
    name?: string;
  };
}

const categoryList = ["All", "Ahmedabad", "Surat", "Gandhinagar", "Vadodara"];
const cityList = ["All", "Ahmedabad", "Surat", "Jamnagar", "Gandhinagar", "Vadodara"];
const imageColors = [
  "from-blue-500 to-indigo-700",
  "from-fuchsia-500 to-purple-700",
  "from-emerald-400 to-teal-600",
  "from-rose-500 to-pink-700",
  "from-orange-400 to-rose-600",
];

export default function EntertainmentEventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCity, setActiveCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoadingEvents(true);
        const response = await fetchJson('/api/events');
        const backendEvents: BackendEventItem[] = response?.events ?? [];

        const mappedEvents = backendEvents.map((event, index) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          city: event.city || 'Unknown',
          category: event.city || 'Local',
          date: new Date(event.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          location: event.city ? `${event.city} Arena` : 'Unknown location',
          startingPrice: 499 + (index % 5) * 300,
          imageColor: imageColors[index % imageColors.length],
          hostName: event.host?.name,
        }));

        setEvents(mappedEvents);
        setEventsError(null);
      } catch (error: any) {
        setEventsError(error.message || 'Failed to load events.');
      } finally {
        setIsLoadingEvents(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesCity = activeCity === 'All' || event.city === activeCity;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.hostName ?? '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-12">
      <Navbar showProfileIcon={true} />

      <PageContainer className="mt-6 md:mt-8">
        <Link
          href="/choose-activity"
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Activities
        </Link>

        <SectionHeader
          title="Explore Local Events"
          subtitle="Book tickets for live sports, wellness, and community experiences."
          actions={
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="relative w-full md:w-40">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737688]" />
                <select
                  value={activeCity}
                  onChange={(e) => setActiveCity(e.target.value)}
                  className="w-full md:w-40 pl-9 pr-8 py-2.5 bg-white border border-[#c3c5d9] rounded-xl text-sm font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#003ec7] focus:border-[#003ec7] appearance-none cursor-pointer"
                >
                  {cityList.map((city) => (
                    <option key={city} value={city}>
                      {city === 'All' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search events or hosts..."
                icon={Search}
                className="flex-grow w-full md:w-64"
              />
            </div>
          }
        />

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-6 mt-2">
          {categoryList.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#0b1c30] text-white shadow-md'
                  : 'bg-white text-[#434656] border border-[#e5eeff] hover:border-[#003ec7] hover:text-[#003ec7]'
              }`}
            >
              {category === 'All' ? 'All Cities' : category}
            </button>
          ))}
        </div>

        {isLoadingEvents ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
          </div>
        ) : eventsError ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#e5eeff]">
            <p className="text-[#434656]">{eventsError}</p>
          </div>
        ) : (
          <>
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
                    {event.hostName && (
                      <p className="text-sm text-[#737688] mb-3">Hosted by {event.hostName}</p>
                    )}

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

            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#e5eeff] mt-6">
                <Calendar className="w-12 h-12 text-[#c3c5d9] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0b1c30]">No events found</h3>
                <p className="text-[#737688]">Try a different city or search keyword.</p>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}
