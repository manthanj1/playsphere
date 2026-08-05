"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SectionHeader from "@/components/SectionHeader";
import SearchInput from "@/components/SearchInput";
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
      <Navbar logoAsSpan={true} />

      <PageContainer className="pb-16">
        <SectionHeader
          title="Where are you playing today?"
          subtitle="Choose a city to explore top-tier courts, find local players, and join high-adrenaline events happening right now."
          actions={
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search cities..."
              icon={Search}
              className="w-full max-w-md"
            />
          }
          className="mt-8 md:mt-16 mb-6"
        />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#0b1c30]">Main Cities</h2>
          {searchQuery && (
            <span className="text-sm font-medium text-[#737688]">
              Found {filteredCities.length} result{filteredCities.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Link 
                key={city.id}
                href={`/choose-activity?city=${city.id}`} 
                className={`${city.gridClass} relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] hover:-translate-y-1 transition-all duration-300 border border-[#d3e4fe] group block`}
              >
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#0b1c30]/${city.isFeatured ? '90' : '80'} to-transparent flex flex-col justify-end ${city.isFeatured ? 'p-10' : 'p-6'}`}>
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
      </PageContainer>
    </div>
  );
}
