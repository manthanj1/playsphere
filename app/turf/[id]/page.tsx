"use client";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Car, 
  Droplets, 
  Lightbulb, 
  ShieldCheck, 
  Coffee,
  Share2,
  Heart,
  User,
  AlertCircle
} from "lucide-react";

// --- MOCK DATA ---
// Brought over from the sports listing page to match IDs
const mockTurfs = [
  { id: 1, name: "Spartan Box Cricket", city: "Ahmedabad", location: "Sindhu Bhavan Road", sport: "Cricket", price: 1200, rating: 4.8, reviews: 124, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA" },
  { id: 2, name: "KickOff Football Arena", city: "Ahmedabad", location: "SG Highway", sport: "Football", price: 1500, rating: 4.9, reviews: 89, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg" },
  { id: 3, name: "Titan Padel Hub", city: "Ahmedabad", location: "Thaltej", sport: "Padel", price: 1800, rating: 4.9, reviews: 32, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ" },
  { id: 4, name: "Diamond City Sports Hub", city: "Surat", location: "Vesu", sport: "Cricket", price: 1000, rating: 4.7, reviews: 210, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA" },
  { id: 5, name: "Tapi Green Football", city: "Surat", location: "Adajan", sport: "Football", price: 1400, rating: 4.6, reviews: 167, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg" },
  { id: 6, name: "Surat Tennis Academy", city: "Surat", location: "Piplod", sport: "Tennis", price: 900, rating: 4.8, reviews: 88, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ" },
  { id: 7, name: "Banyan City Box", city: "Vadodara", location: "Alkapuri", sport: "Cricket", price: 1100, rating: 4.5, reviews: 56, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA" },
  { id: 8, name: "Vadodara Multi-Sport Arena", city: "Vadodara", location: "Sama-Savli Road", sport: "Multi-sport", price: 1300, rating: 4.7, reviews: 142, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCALijbBIkKtCLNRjYE26kZ8HXn2wPWzKImGBd6WTKylX9XeYw8ENhGlI3DFh_g-PQTzfS8FfvLvKXDR1Yvgq3UCDDEpvf28UuRVFw-UJy9IM5lc__h3I1WJfQuHXKYoRCOcu6z7ButltxHOF-2z5d8HVCPunwtunrYEa8Q3cwyWRdGMqmB2bIpjYFX0MqA2icSArQRTjag9m19j1VOoQm84wMLdAQg8p8TjOTsUhWUY0tOEGjBEhG4sQ" }
];

// Generate next 7 days for the date picker
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    dates.push({
      date: nextDate,
      dayName: i === 0 ? "Today" : nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: nextDate.getDate(),
      month: nextDate.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return dates;
};

// Mock time slots
const timeSlots = [
  "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", 
  "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"
];

export default function TurfDetailPage() {
  const router = useRouter();
  const params = useParams(); // Fetch the ID from the URL
  
  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(0); 
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  // Find the specific turf based on the URL ID parameter
  const baseTurf = mockTurfs.find((t) => t.id.toString() === params.id);

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  // If the ID in the URL doesn't match any data, show an error state
  if (!baseTurf) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9ff] text-[#0b1c30]">
        <AlertCircle className="w-12 h-12 text-[#e11d48] mb-4" />
        <h1 className="text-2xl font-bold font-serif mb-2">Arena Not Found</h1>
        <p className="text-[#434656] mb-6">We couldn't find the sports arena you're looking for.</p>
        <button onClick={() => router.back()} className="text-[#003ec7] font-semibold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  // Construct the full detailed view dynamically based on the matched turf
  const turfDetail = {
    ...baseTurf,
    address: `${baseTurf.location}, ${baseTurf.city}`,
    description: `Experience premium ${baseTurf.sport.toLowerCase()} at ${baseTurf.name}. Equipped with high-visibility LED floodlights, professional-grade surfaces, and ample spectator seating. Perfect for corporate tournaments and casual weekend matches alike.`,
    images: [baseTurf.image],
    amenities: [
      { icon: Car, label: "Free Parking" },
      { icon: Droplets, label: "RO Water" },
      { icon: Lightbulb, label: "LED Floodlights" },
      { icon: ShieldCheck, label: "First Aid Kit" },
      { icon: Coffee, label: "Cafeteria" },
    ]
  };

  const totalPrice = selectedSlots.length * turfDetail.price;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans antialiased pb-20 md:pb-0">
      
    <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 md:py-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        {/* Hero Image Section */}
        <div className="w-full h-[30vh] md:h-[50vh] rounded-2xl md:rounded-3xl overflow-hidden relative mb-8 shadow-sm group">
          <img 
            src={turfDetail.images[0]} 
            alt={turfDetail.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/80 via-transparent to-transparent"></div>
          
          {/* Tags on Image */}
          <div className="absolute top-4 left-4 bg-[#003ec7] text-white px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-md">
            {turfDetail.sport}
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#0b1c30] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#e11d48] transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Title & Basic Info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#0b1c30] leading-tight">
                  {turfDetail.name}
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[#434656] text-base mb-4 mt-2">
                <div className="flex items-center gap-1.5 bg-[#e5eeff] text-[#003ec7] px-3 py-1 rounded-lg font-semibold">
                  <Star className="w-4 h-4 fill-[#003ec7]" />
                  {turfDetail.rating} ({turfDetail.reviews} reviews)
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-[#003ec7]" />
                  {turfDetail.address}
                </div>
              </div>
            </div>

            <hr className="border-[#c3c5d9]" />

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-4">About this Arena</h2>
              <p className="text-[#434656] text-lg leading-relaxed">
                {turfDetail.description}
              </p>
            </section>

            <hr className="border-[#c3c5d9]" />

            {/* Amenities Section */}
            <section>
              <h2 className="text-2xl font-bold font-serif text-[#0b1c30] mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {turfDetail.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#0b1c30] bg-white border border-[#c3c5d9] p-4 rounded-xl shadow-sm hover:border-[#003ec7] transition-colors">
                    <div className="w-10 h-10 bg-[#e5eeff] rounded-full flex items-center justify-center text-[#003ec7] shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#c3c5d9] rounded-2xl p-6 shadow-[0_12px_32px_rgba(11,28,48,0.08)]">
              
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-[#eff4ff]">
                <div>
                  <span className="text-sm font-semibold text-[#737688] uppercase tracking-wide block mb-1">Price per hour</span>
                  <div className="text-3xl font-extrabold text-[#0b1c30]">
                    ₹{turfDetail.price}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#003ec7] font-semibold bg-[#e5eeff] px-2 py-1 rounded">
                  <Clock className="w-4 h-4" /> Open 24/7
                </div>
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <h3 className="font-bold text-[#0b1c30] mb-3">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dates.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedDate(index)}
                      className={`flex flex-col items-center justify-center min-w-[72px] p-3 rounded-xl border transition-all ${
                        selectedDate === index 
                        ? "bg-[#003ec7] border-[#003ec7] text-white shadow-md transform -translate-y-1" 
                        : "bg-white border-[#c3c5d9] text-[#434656] hover:border-[#003ec7]"
                      }`}
                    >
                      <span className={`text-xs font-semibold uppercase ${selectedDate === index ? "text-[#dce9ff]" : "text-[#737688]"}`}>
                        {item.month}
                      </span>
                      <span className="text-xl font-bold my-0.5">{item.dayNumber}</span>
                      <span className={`text-xs ${selectedDate === index ? "text-white" : "text-[#0b1c30]"}`}>
                        {item.dayName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selector */}
              <div className="mb-8">
                <h3 className="font-bold text-[#0b1c30] mb-3">Available Slots (Evening)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`py-2.5 px-2 text-sm font-semibold rounded-lg border transition-all ${
                          isSelected
                          ? "bg-[#e5eeff] border-[#003ec7] text-[#003ec7]"
                          : "bg-white border-[#c3c5d9] text-[#434656] hover:border-[#003ec7] hover:text-[#003ec7]"
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Total & Checkout */}
              {selectedSlots.length > 0 && (
                <div className="bg-[#f8f9ff] p-4 rounded-xl mb-6 border border-[#e5eeff]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium">Selected Slots ({selectedSlots.length})</span>
                    <span className="text-[#0b1c30] font-bold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#434656] font-medium">Platform Fee</span>
                    <span className="text-[#0b1c30] font-bold">₹40</span>
                  </div>
                  <div className="border-t border-[#c3c5d9] pt-2 mt-2 flex justify-between items-center">
                    <span className="text-[#0b1c30] font-bold text-lg">Total</span>
                    <span className="text-[#003ec7] font-extrabold text-xl">₹{totalPrice + 40}</span>
                  </div>
                </div>
              )}

              <Link href="/payment" className="w-full">
                <button 
                  disabled={selectedSlots.length === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedSlots.length > 0 
                    ? "bg-[#003ec7] text-white hover:bg-[#002f96] hover:shadow-lg transform hover:-translate-y-1" 
                    : "bg-[#e5eeff] text-[#737688] cursor-not-allowed"
                  }`}
                >
                  {selectedSlots.length > 0 ? "Proceed to Payment" : "Select a Time Slot"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}