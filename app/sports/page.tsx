"use client";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SearchInput from "@/components/SearchInput";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  User, 
  ArrowLeft,
  Star,
  Clock,
  Filter
} from "lucide-react";

// --- EXPANDED MOCK DATA ---
const mockTurfs = [
  // AHMEDABAD
  {
    id: 1,
    name: "Spartan Box Cricket",
    city: "Ahmedabad",
    location: "Sindhu Bhavan Road",
    sport: "Cricket",
    price: 1200,
    rating: 4.8,
    reviews: 124,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Available Tonight"
  },
  {
    id: 2,
    name: "KickOff Football Arena",
    city: "Ahmedabad",
    location: "SG Highway",
    sport: "Football",
    price: 1500,
    rating: 4.9,
    reviews: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg",
    availability: "Next Slot: 8:00 PM"
  },
  {
    id: 3,
    name: "Titan Padel Hub",
    city: "Ahmedabad",
    location: "Thaltej",
    sport: "Padel",
    price: 1800,
    rating: 4.9,
    reviews: 32,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ",
    availability: "Available Tonight"
  },
  
  // SURAT
  {
    id: 4,
    name: "Diamond City Sports Hub",
    city: "Surat",
    location: "Vesu",
    sport: "Cricket",
    price: 1000,
    rating: 4.7,
    reviews: 210,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Filling Fast"
  },
  {
    id: 5,
    name: "Tapi Green Football",
    city: "Surat",
    location: "Adajan",
    sport: "Football",
    price: 1400,
    rating: 4.6,
    reviews: 167,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg",
    availability: "Available Tomorrow"
  },
  {
    id: 6,
    name: "Surat Tennis Academy",
    city: "Surat",
    location: "Piplod",
    sport: "Tennis",
    price: 900,
    rating: 4.8,
    reviews: 88,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ",
    availability: "Available Now"
  },

  // VADODARA
  {
    id: 7,
    name: "Banyan City Box",
    city: "Vadodara",
    location: "Alkapuri",
    sport: "Cricket",
    price: 1100,
    rating: 4.5,
    reviews: 56,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Next Slot: 9:00 PM"
  },
  {
    id: 8,
    name: "Vadodara Multi-Sport Arena",
    city: "Vadodara",
    location: "Sama-Savli Road",
    sport: "Multi-sport",
    price: 1300,
    rating: 4.7,
    reviews: 142,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCALijbBIkKtCLNRjYE26kZ8HXn2wPWzKImGBd6WTKylX9XeYw8ENhGlI3DFh_g-PQTzfS8FfvLvKXDR1Yvgq3UCDDEpvf28UuRVFw-UJy9IM5lc__h3I1WJfQuHXKYoRCOcu6z7ButltxHOF-2z5d8HVCPunwtunrYEa8Q3cwyWRdGMqmB2bIpjYFX0MqA2icSArQRTjag9m19j1VOoQm84wMLdAQg8p8TjOTsUhWUY0tOEGjBEhG4sQ",
    availability: "Available Tonight"
  }
];

const categories = ["All", "Cricket", "Football", "Tennis", "Padel", "Multi-sport"];

function SportsListingContent() {
  const searchParams = useSearchParams();
  // Get city from URL, default to empty string if not found
  const cityQuery = searchParams.get("city")?.toLowerCase() || "";
  const cityName = cityQuery 
    ? cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1) 
    : "All Cities";

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // UPDATED FILTER LOGIC: Now filters by City as well
  const filteredTurfs = mockTurfs.filter(turf => {
    // Check if the turf matches the city in the URL (if a city is selected)
    const matchesCity = cityQuery === "" || turf.city.toLowerCase() === cityQuery;
    
    // Check category
    const matchesCategory = activeCategory === "All" || turf.sport === activeCategory;
    
    // Check search bar
    const matchesSearch = turf.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          turf.location.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesCity && matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-sans antialiased pb-20 md:pb-0">

    <Navbar 
      centerContent={
      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#e5eeff] text-[#003ec7] rounded-full border border-[#d3e4fe] shadow-sm">
      <MapPin className="w-4 h-4" />
      <span className="text-sm font-semibold tracking-wide">
        {cityName}
      </span>
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

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${cityName} turfs...`}
            icon={Search}
            className="w-full md:w-80"
          />
        </div>

        {/* Categories / Filters */}
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

        {/* Turf Grid */}
        {filteredTurfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTurfs.map((turf) => (
              <div 
                key={turf.id} 
                className="bg-white rounded-2xl overflow-hidden border border-[#c3c5d9] shadow-[0_4px_20px_rgba(11,28,48,0.04)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.1)] transition-all duration-300 group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={turf.image} 
                    alt={turf.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#0b1c30] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#a94900] text-[#a94900]" />
                    {turf.rating} <span className="text-[#737688] font-medium">({turf.reviews})</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#003ec7] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                    {turf.sport}
                  </div>
                </div>

                {/* Content Section */}
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
          /* Empty State */
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#c3c5d9] border-dashed">
            <div className="w-16 h-16 bg-[#eff4ff] text-[#003ec7] rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">No arenas found in {cityName}</h3>
            <p className="text-[#434656] max-w-md">
              We couldn't find any {activeCategory !== "All" ? activeCategory : ""} turfs matching "{searchQuery}". Try adjusting your filters.
            </p>
            <button 
              onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
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

export default function SportsListingPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8f9ff] text-[#003ec7]">
        <div className="w-8 h-8 border-4 border-[#003ec7] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold">Finding Arenas...</p>
      </div>
    }>
      <SportsListingContent />
    </Suspense>
  );
}