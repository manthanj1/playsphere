"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";

// Full mock database matching the main page events
const EVENT_DATABASE = [
  {
    id: "ev-navratri-01",
    title: "Jamnagar Grand Navratri Mahotsav 2026",
    description: "Join the biggest Garba celebration in Jamnagar. Featuring top vocalists, a massive traditional arena, and food stalls from across Saurashtra.",
    date: "Oct 15 - Oct 24, 2026",
    location: "Reliance Greens, Jamnagar",
    imageColor: "from-fuchsia-500 to-purple-700",
    tiers: [
      { id: "t1", name: "1-Day Pass (Viewer)", price: 1200, features: ["Entry to viewing galleries", "Food court access"] },
      { id: "t2", name: "1-Day Pass (Player)", price: 2000, features: ["Ground access for playing", "Free water bottles"] },
      { id: "t3", name: "Season Pass (9 Days)", price: 15000, features: ["Ground access all days", "VIP entry gate", "Lounge access"] }
    ]
  },
  {
    id: "ev-concert-02",
    title: "Arijit Singh Live Symphony",
    description: "Experience the magic of live music with a spectacular audio-visual setup. Join thousands of fans for a night of soulful melodies.",
    date: "Aug 28, 2026 • 07:30 PM",
    location: "Narendra Modi Stadium, Ahmedabad",
    imageColor: "from-blue-500 to-indigo-700",
    tiers: [
      { id: "t1", name: "General Admission", price: 2500, features: ["Entry to the venue", "Standing arena access"] },
      { id: "t2", name: "Gold Seating", price: 4500, features: ["Reserved seating", "Dedicated food stalls"] },
      { id: "t3", name: "Diamond Lounge", price: 8000, features: ["Premium stage view", "Welcome drink", "Lounge access"] },
      { id: "t4", name: "VIP Backstage Pass", price: 15000, features: ["Meet & Greet chance", "Front row access", "Exclusive merchandise"] },
    ]
  },
  {
    id: "ev-comedy-03",
    title: "Gujarati Standup Special",
    description: "An evening of non-stop laughter featuring top local comedians bringing you the best observational comedy about daily life.",
    date: "Aug 12, 2026 • 09:00 PM",
    location: "Town Hall, Gandhinagar",
    imageColor: "from-emerald-400 to-teal-600",
    tiers: [
      { id: "t1", name: "Balcony Seating", price: 499, features: ["Balcony access"] },
      { id: "t2", name: "Premium Stalls", price: 999, features: ["Close up view", "Comfortable seating"] },
      { id: "t3", name: "Front Row VIP", price: 1499, features: ["Front row seats", "Meet & Greet post-show"] },
    ]
  },
  {
    id: "ev-navratri-04",
    title: "Surat Diamond City Garba",
    description: "Experience the modern touch to traditional Garba with Surat's finest. Air-conditioned indoor dome and live orchestra.",
    date: "Oct 16 - Oct 24, 2026",
    location: "Sarsana Convention Centre, Surat",
    imageColor: "from-rose-500 to-pink-700",
    tiers: [
      { id: "t1", name: "Daily Pass", price: 1500, features: ["Air-conditioned arena access"] },
      { id: "t2", name: "Season Pass", price: 12000, features: ["Express entry", "Reserved parking"] }
    ]
  },
  {
    id: "ev-culture-05",
    title: "Saurashtra Heritage Fair",
    description: "A celebration of arts, crafts, and heritage. Support local artisans and enjoy folk performances throughout the day.",
    date: "Sep 05, 2026 • 10:00 AM",
    location: "Mela Ground, Surendranagar",
    imageColor: "from-orange-400 to-rose-600",
    tiers: [
      { id: "t1", name: "Standard Entry", price: 150, features: ["Fair access", "Open seating for performances"] },
      { id: "t2", name: "Workshop Pass", price: 500, features: ["Standard Entry", "Access to 1 pottery workshop"] }
    ]
  }
];

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Look up the specific event based on the unwrapped ID
  const currentEvent = EVENT_DATABASE.find((e) => e.id === resolvedParams.id);

  const handleProceedToPayment = () => {
    if (!selectedTier) return;
    router.push("/payment");
  };

  // 404 Fallback if an invalid ID is passed
  if (!currentEvent) {
    return (
      <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-black text-[#0b1c30]">Event Not Found</h1>
        <button 
          onClick={() => router.back()}
          className="mt-6 text-[#003ec7] font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9ff] min-h-screen text-[#0b1c30] font-sans antialiased pb-24">
      <Navbar showProfileIcon={true} />

      <PageContainer className="mt-8">
        {/* Back Navigation to Main Events Page */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#434656] hover:text-[#003ec7] transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Event Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`w-full h-64 md:h-80 rounded-3xl bg-gradient-to-r ${currentEvent.imageColor} shadow-md`}>
              {/* Image Placeholder */}
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-serif text-[#0b1c30] mb-4">
                {currentEvent.title}
              </h1>
              
              <div className="flex flex-col gap-3 mb-6 bg-white p-5 rounded-2xl border border-[#e5eeff]">
                <div className="flex items-center gap-3 text-[#434656]">
                  <Calendar className="w-5 h-5 text-[#003ec7]" />
                  <span className="font-semibold text-lg">{currentEvent.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[#434656]">
                  <MapPin className="w-5 h-5 text-[#003ec7]" />
                  <span className="font-semibold text-lg">{currentEvent.location}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#003ec7]" />
                  About the Event
                </h3>
                <p className="text-[#434656] leading-relaxed text-lg">
                  {currentEvent.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Selection */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#e5eeff] shadow-[0_12px_32px_rgba(11,28,48,0.04)] sticky top-24">
              <h2 className="text-2xl font-black text-[#0b1c30] mb-6">Select Tickets</h2>
              
              <div className="space-y-4 mb-8">
                {currentEvent.tiers.map((tier) => (
                  <label 
                    key={tier.id}
                    className={`block cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300 ${
                      selectedTier === tier.id 
                        ? "border-[#003ec7] bg-[#f0f4ff]" 
                        : "border-[#e5eeff] hover:border-[#c3c5d9]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="ticket-tier"
                          value={tier.id}
                          checked={selectedTier === tier.id}
                          onChange={() => setSelectedTier(tier.id)}
                          className="w-5 h-5 text-[#003ec7] focus:ring-[#003ec7] mt-1"
                        />
                        <div>
                          <h4 className="font-bold text-[#0b1c30] text-lg">{tier.name}</h4>
                          <ul className="mt-2 space-y-1">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-[#434656] flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#003ec7]" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <span className="font-black text-xl text-[#0b1c30]">₹{tier.price}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button 
                onClick={handleProceedToPayment}
                disabled={!selectedTier}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedTier 
                    ? "bg-[#003ec7] hover:bg-[#0052ff] text-white shadow-lg hover:shadow-xl hover:-translate-y-1" 
                    : "bg-[#e5eeff] text-[#737688] cursor-not-allowed"
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>

        </div>
      </PageContainer>
    </div>
  );
}