"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

const CITIES_DATA = [
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    events: 342,
    image: "/cities/ahmedabad.jpg",
    gridClass: "md:col-span-8 row-span-2",
    isFeatured: true,
    tag: "Active Events",
  },
  {
    id: "surat",
    name: "Surat",
    events: 215,
    image: "/cities/surat.jpg",
    gridClass: "md:col-span-4 row-span-1",
    isFeatured: false,
    tag: "Trending",
  },
  {
    id: "vadodara",
    name: "Vadodara",
    events: 189,
    image: "/cities/vadodara.jpg",
    gridClass: "md:col-span-4 row-span-1",
    isFeatured: false,
  },
  {
    id: "rajkot",
    name: "Rajkot",
    events: 94,
    image: "/cities/rajkot.jpg",
    gridClass: "md:col-span-4 row-span-1",
    isFeatured: false,
  },
  {
    id: "bhavnagar",
    name: "Bhavnagar",
    events: 120,
    image: "/cities/bhavnagar.jpg",
    gridClass: "md:col-span-4 row-span-1",
    isFeatured: false,
  },
];

export default function SelectCityPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = CITIES_DATA.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans">
      
      {/* TopAppBar - Simplified */}
      <header className="bg-[#f8f9ff] shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-center md:justify-start items-center w-full px-4 md:px-12 py-4 max-w-[1280px] mx-auto">
          <span className="font-serif text-3xl md:text-4xl italic font-black text-[#003ec7] tracking-tighter hover:text-[#0052ff] transition-colors">
            PlaySphere
          </span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-[88px] pb-16 px-4 md:px-12 max-w-[1280px] mx-auto w-full">
        
        {/* Header Section */}
        <section className="mt-8 md:mt-16 mb-12 text-center md:text-left flex flex-col items-center md:items-start">
          <span className="inline-block px-4 py-1 rounded-full bg-[#dce9ff] text-[#434656] text-xs font-semibold mb-4 border border-[#c3c5d9] uppercase tracking-wider">
            Select Location
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-[#0b1c30] mb-4">
            Where are you playing today?
          </h1>
          <p className="text-lg text-[#434656] max-w-2xl">
            Choose a city to explore top-tier courts, find local players, and join high-adrenaline events happening right now.
          </p>
          
          {/* Search Input */}
          <div className="mt-8 w-full max-w-md relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#737688]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c3c5d9] bg-white focus:outline-none focus:border-[#003ec7] focus:ring-2 focus:ring-[#b7c4ff] transition-all text-[#0b1c30] placeholder:text-[#737688]" 
            />
          </div>
        </section>

        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#0b1c30]">Main Cities</h2>
          {searchQuery && (
            <span className="text-sm font-medium text-[#737688]">
              Found {filteredCities.length} result{filteredCities.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Bento Grid for Cities */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Link 
                key={city.id}
                // Redirects to /choose-activity and passes the city ID via query parameter
                href={`/choose-activity?city=${city.id}`} 
                className={`${city.gridClass} relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] hover:-translate-y-1 transition-all duration-300 border border-[#d3e4fe] group block`}
              >
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#0b1c30]/${city.isFeatured ? '90' : '80'} to-transparent flex flex-col justify-end p-${city.isFeatured ? '10' : '6'}`}>
                  
                  {city.tag && (
                    city.isFeatured ? (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#a94900] text-[#ffdece] text-xs font-semibold uppercase tracking-wide">
                          <span className="w-2 h-2 rounded-full bg-[#ffdece] mr-1.5 animate-pulse"></span>
                          {city.events} {city.tag}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-1 self-start">
                        {city.tag}
                      </span>
                    )
                  )}

                  <h2 className={`font-serif ${city.isFeatured ? 'text-3xl' : 'text-2xl'} font-bold text-white`}>
                    {city.name}
                  </h2>
                  
                  <p className="text-sm text-white opacity-90 mt-2 flex items-center">
                    {city.isFeatured ? (
                      <><MapPin className="w-4 h-4 mr-1" /> India</>
                    ) : (
                      `${city.events} Events`
                    )}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-1 md:col-span-12 py-16 text-center border-2 border-dashed border-[#c3c5d9] rounded-2xl bg-white">
              <p className="text-[#434656] text-lg">No cities found matching "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-[#003ec7] font-semibold hover:underline focus:outline-none"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}