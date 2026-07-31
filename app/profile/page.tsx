"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Search, 
  Pencil, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Calendar, 
  Trophy, 
  CheckCircle, 
  UserPlus, 
  Compass, 
  Ticket, 
  User 
} from "lucide-react";

// Define the shape of our user data
interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  bookingsCount: number;
  tournamentsCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the logged-in user data from localStorage (or your state manager)
    // Replace 'playSphereUser' with whatever key you used in your Login flow
    const storedUser = localStorage.getItem("playSphereUser");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Map the stored data to our profile state, providing defaults for missing fields
        setUserData({
          name: parsedUser.name || "Player One",
          email: parsedUser.email || "player@example.com",
          phone: parsedUser.phone || "+91 XXXXX XXXXX",
          bio: parsedUser.bio || "PlaySphere Athlete",
          location: parsedUser.city || "Gujarat, India",
          bookingsCount: parsedUser.bookingsCount || 0,
          tournamentsCount: parsedUser.tournamentsCount || 0,
        });
      } catch (error) {
        console.error("Failed to parse user data");
      }
    } else {
      // 2. If no user is found, redirect to the login page
      // Uncomment the line below once your routing is fully set up
      // router.push("/login");
      
      // For now, we will just set a fallback so the page doesn't crash during development
      setUserData({
        name: "Guest User",
        email: "guest@playsphere.com",
        phone: "Add phone number",
        bio: "New to the arena",
        location: "Select a city",
        bookingsCount: 0,
        tournamentsCount: 0,
      });
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    // Clear the user session
    localStorage.removeItem("playSphereUser");
    // Redirect to login page
    router.push("/login");
  };

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8f9ff] text-[#003ec7]">
        <div className="w-8 h-8 border-4 border-[#003ec7] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold">Loading Profile...</p>
      </div>
    );
  }

  // Ensure userData exists before rendering to avoid TS errors
  if (!userData) return null;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen pb-20 md:pb-0 antialiased">
      
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 bg-[#f8f9ff] shadow-sm w-full">
        <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1280px] mx-auto">
          <Link href="/" className="text-3xl md:text-4xl italic font-black font-serif text-[#003ec7] tracking-tighter">
            PlaySphere
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center h-full">
            <Link href="/select-city" className="text-[#434656] font-medium hover:text-[#003ec7] transition-colors py-2 text-sm tracking-wide">
              Explore
            </Link>
            <Link href="#" className="text-[#434656] font-medium hover:text-[#003ec7] transition-colors py-2 text-sm tracking-wide">
              Competitions
            </Link>
            <Link href="#" className="text-[#434656] font-medium hover:text-[#003ec7] transition-colors py-2 text-sm tracking-wide">
              Bookings
            </Link>
            <Link href="/profile" className="text-[#003ec7] font-bold border-b-2 border-[#003ec7] hover:text-[#003ec7] transition-colors py-2 text-sm tracking-wide">
              Profile
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="text-[#003ec7] p-2 hover:bg-[#dce9ff] rounded-full transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-[#003ec7] p-2 hover:bg-[#dce9ff] rounded-full transition-colors flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
            <div className="hidden md:block w-10 h-10 rounded-full overflow-hidden border-2 border-[#003ec7] bg-[#e5eeff] flex items-center justify-center">
              <User className="w-6 h-6 text-[#003ec7] mt-1" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Profile Sidebar / Header */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* User Identity Card */}
            <div className="bg-white rounded-2xl border border-[#c3c5d9] p-6 shadow-[0_4px_20px_rgba(11,28,48,0.05)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dce9ff] to-transparent opacity-50 z-0"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-[#e5eeff] shadow-md mb-4 relative flex items-center justify-center">
                  <User className="w-16 h-16 text-[#003ec7]" />
                  <button className="absolute bottom-1 right-1 bg-[#003ec7] text-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Dynamically inserted User Name & Bio */}
                <h1 className="text-2xl font-bold font-serif text-[#0b1c30] mb-1">{userData.name}</h1>
                <p className="text-base text-[#434656] mb-6">{userData.bio}</p>
                
                <div className="w-full flex justify-around border-t border-[#c3c5d9] pt-4 mt-2">
                  <div className="text-center">
                    <span className="block text-2xl font-bold font-serif text-[#003ec7]">{userData.bookingsCount}</span>
                    <span className="text-xs font-medium text-[#434656] uppercase tracking-wider">Bookings</span>
                  </div>
                  <div className="text-center border-l border-[#c3c5d9] pl-4">
                    <span className="block text-2xl font-bold font-serif text-[#003ec7]">{userData.tournamentsCount}</span>
                    <span className="text-xs font-medium text-[#434656] uppercase tracking-wider">Tournaments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl border border-[#c3c5d9] p-6 shadow-[0_4px_20px_rgba(11,28,48,0.05)]">
              <h2 className="text-xl font-bold font-serif text-[#0b1c30] mb-4">Contact Info</h2>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#737688]" />
                  {/* Dynamically inserted Email */}
                  <span className="text-base">{userData.email}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#737688]" />
                  {/* Dynamically inserted Phone */}
                  <span className="text-base">{userData.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#737688]" />
                  {/* Dynamically inserted Location */}
                  <span className="text-base">{userData.location}</span>
                </li>
              </ul>
              <button className="mt-6 w-full border-2 border-[#003ec7] text-[#003ec7] font-semibold text-base py-3 px-6 rounded-lg hover:bg-[#dce9ff]/50 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Dynamic Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full bg-[#ffdad6] text-[#93000a] font-semibold text-base py-3 px-6 rounded-lg hover:bg-[#ba1a1a] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 flex flex-col gap-8 mt-8 md:mt-0">
            {/* The rest of your Upcoming Bookings & Recent Activity content goes here... */}
            {/* Keeping it identical to the previous step for layout consistency */}
            
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#0b1c30]">Upcoming Bookings</h2>
                <Link href="#" className="text-[#003ec7] font-semibold text-sm hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Booking Card 1 */}
                <div className="bg-white rounded-2xl border border-[#c3c5d9] p-0 shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] transition-shadow hover:-translate-y-1 transform duration-200 overflow-hidden flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 h-48 sm:h-auto relative bg-[#e5eeff] flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-[#003ec7] opacity-20 absolute" />
                    <div className="absolute top-3 left-3 bg-[#003ec7] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      Tennis
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-serif text-[#0b1c30] mb-1">Sardar Patel Stadium - Court 4</h3>
                      <p className="text-[#434656] text-base flex items-center gap-1.5 mb-4">
                        <Calendar className="w-4 h-4" /> Aug 15, 2026 • 6:00 PM - 8:00 PM
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-[#003ec7] hover:bg-[#0038b6] transition-colors text-white font-semibold text-sm py-2 px-4 rounded-lg flex-1">Modify</button>
                      <button className="border border-[#737688] hover:bg-[#f8f9ff] transition-colors text-[#0b1c30] font-semibold text-sm py-2 px-4 rounded-lg">Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-[#f8f9ff] border-t border-[#c3c5d9] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <Link href="/select-city" className="flex flex-col items-center justify-center text-[#434656] px-4 py-1 hover:bg-[#dce9ff] rounded-xl transition-all">
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Explore</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-[#434656] px-4 py-1 hover:bg-[#dce9ff] rounded-xl transition-all">
          <Trophy className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Competitions</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-[#434656] px-4 py-1 hover:bg-[#dce9ff] rounded-xl transition-all">
          <Ticket className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Bookings</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center bg-[#0052ff] text-[#dfe3ff] rounded-xl px-4 py-1 scale-90 transition-all duration-150">
          <User className="w-5 h-5 mb-1" fill="currentColor" />
          <span className="text-xs font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}