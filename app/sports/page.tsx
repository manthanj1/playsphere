"use client";

export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SearchInput from "@/components/SearchInput";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ArrowLeft,
  Star,
  Clock,
  Filter,
} from "lucide-react";
import { turfService, TurfItem } from "@/services/turfService";

const categories = ["All", "Cricket", "Football", "Tennis", "Padel", "Multi-sport"];

export default function SportsListingPage() {
  const router = useRouter();
  const [cityQuery, setCityQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCityQuery(params.get("city")?.toLowerCase() || "");
  }, []);
  const cityName = cityQuery ? cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1) : "All Cities";

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTurfs() {
      try {
        setIsLoading(true);
        const response = await turfService.getAllTurfs();
        setTurfs(response?.turfs ?? []);
        setLoadError(null);
      } catch (error: any) {
        setLoadError(error.message || 'Unable to fetch turfs.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTurfs();
  }, []);

  const filteredTurfs = turfs.filter((turf) => {
    const matchesCity = cityQuery === "" || turf.city.toLowerCase() === cityQuery;
    const matchesCategory = activeCategory === "All" || turf.sport === activeCategory;
    const matchesSearch =
      turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-sans antialiased pb-20 md:pb-0">
      <Navbar
        centerContent={
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#e5eeff] text-[#003ec7] rounded-full border border-[#d3e4fe] shadow-sm">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">{cityName}</span>
          </div>
        }
      />

      <PageContainer className="py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href={`/choose-activity?city=${cityQuery || 'default'}`}
              className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#0b1c30]">
              Sports Arenas in {cityName}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={cityQuery}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setCityQuery(newCity);
                  router.push(`/sports${newCity ? `?city=${newCity}` : ''}`);
                }}
                className="w-full sm:w-auto appearance-none bg-white border border-[#c3c5d9] text-[#0b1c30] font-semibold text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all cursor-pointer"
              >
                <option value="">All Cities</option>
                <option value="ahmedabad">Ahmedabad</option>
                <option value="surat">Surat</option>
                <option value="gandhinagar">Gandhinagar</option>
                <option value="vadodara">Vadodara</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#737688]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search turfs...`}
              icon={Search}
              className="w-full sm:w-64 md:w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <div className="flex items-center justify-center p-2 bg-white border border-[#c3c5d9] rounded-lg mr-2">
            <Filter className="w-5 h-5 text-[#434656]" />
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeCategory === category
                  ? "bg-[#003ec7] text-white shadow-md"
                  : "bg-white text-[#434656] border border-[#c3c5d9] hover:bg-[#e5eeff] hover:text-[#003ec7] hover:border-[#003ec7]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full border-4 border-[#003ec7] border-t-transparent animate-spin" />
          </div>
        ) : loadError ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#e5eeff]">
            <p className="text-[#434656]">{loadError}</p>
          </div>
        ) : filteredTurfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTurfs.map((turf) => (
              <div
                key={turf.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#c3c5d9] shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.1)] transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={turf.image}
                    alt={turf.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 right-3 bg-[#003ec7] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                    {turf.sport}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-serif text-[#0b1c30] leading-tight">
                      {turf.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#434656] text-sm mb-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{turf.location}, {turf.city}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#003ec7] text-sm font-medium mb-auto pb-4">
                    <Clock className="w-4 h-4" />
                    {turf.availability}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#eff4ff]">
                    <div>
                      <span className="text-xs text-[#737688] font-medium uppercase tracking-wider block">Price</span>
                      <div className="text-lg font-bold text-[#0b1c30]">
                        ₹{turf.price} <span className="text-sm font-normal text-[#434656]">/ hr</span>
                      </div>
                    </div>

                    <Link
                      href={`/turf/${turf.id}`}
                      className="bg-[#e5eeff] hover:bg-[#003ec7] text-[#003ec7] hover:text-white transition-colors duration-200 px-6 py-2.5 rounded-lg font-semibold text-sm inline-flex items-center justify-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#c3c5d9] border-dashed">
            <div className="w-16 h-16 bg-[#eff4ff] text-[#003ec7] rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">No arenas found in {cityName}</h3>
            <p className="text-[#434656] max-w-md">
              We couldn't find any {activeCategory !== "All" ? activeCategory : ""} turfs matching "{searchQuery}". Try adjusting your filters.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 text-[#003ec7] font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
