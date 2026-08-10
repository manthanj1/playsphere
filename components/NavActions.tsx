"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bell, LogOut, Loader2, Calendar } from "lucide-react";
import { fetchJson, fetchWithAuth } from "@/lib/api";
import Cookies from "js-cookie";

interface BookingSummary {
  bookingId?: string;
  type: "turf" | "event";
  itemId: string;
  itemName: string;
  sportOrCategory: string;
  city: string;
  date: string;
  slots: string[];
  location: string;
}

export default function NavActions() {
  const router = useRouter();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState<{ name: string; imageUrl: string; email: string } | null>(null);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load local storage data initially
    const storedUser = localStorage.getItem("playSphereUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserProfile({
          name: parsed.name || "User",
          imageUrl: parsed.profilePhoto || parsed.imageUrl || "",
          email: parsed.email || "",
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          // Fetch updated user from backend
          const response = await fetchWithAuth('/api/auth/me');
          
          if (response?.user) {
             setUserProfile(prev => ({
               name: response.user.name,
               imageUrl: response.user.imageUrl || "",
               email: response.user.email
             }));
             localStorage.setItem("playSphereUser", JSON.stringify(response.user));
          }
          
          // Fetch bookings
          setIsLoadingBookings(true);
          const bookingRes = await fetchWithAuth('/api/bookings');
          setBookings(bookingRes?.bookings || []);
        } catch (err) {
          console.error("Error fetching data for NavActions", err);
          if (err instanceof Error && err.message.includes("Unauthorized")) {
             Cookies.remove("token");
             localStorage.removeItem("playSphereUser");
             setUserProfile(null);
             setBookings([]);
          }
        } finally {
          setIsLoadingBookings(false);
        }
      } else {
        setUserProfile(null);
        setBookings([]);
      }
    };
    
    checkAuth();
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("token");
    localStorage.removeItem("playSphereUser");
    router.push("/login");
  };

  const getProfileImageUrl = (url: string) => {
    if (url && !url.startsWith("http") && !url.startsWith("data:")) {
      return `http://localhost:3001${url}`; // Adjust if api URL changes
    }
    return url;
  };

  return (
    <div className="flex items-center gap-4 ml-auto">
      {/* Bell Dropdown */}
      <div className="relative" ref={bellRef}>
        <button
          onClick={() => {
            setIsBellOpen(!isBellOpen);
            setIsProfileOpen(false);
          }}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#003ec7] bg-white transition-colors shadow-sm hover:scale-105 active:scale-95"
        >
          <Bell className="w-5 h-5 text-[#003ec7]" />
          {bookings.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
              {bookings.length}
            </span>
          )}
        </button>

        {isBellOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[#e5eeff] z-50 overflow-hidden">
            <div className="bg-[#f8f9ff] px-4 py-3 border-b border-[#e5eeff]">
              <h3 className="font-bold text-[#0b1c30]">Upcoming Bookings</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isLoadingBookings ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-[#003ec7]" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[#737688]">
                  No upcoming bookings.
                </div>
              ) : (
                <ul className="divide-y divide-[#e5eeff]">
                  {bookings.map((b, i) => (
                    <li key={i} className="p-3 hover:bg-[#f8f9ff] transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm text-[#0b1c30] line-clamp-1">{b.itemName}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-[#434656]">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(b.date).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs font-medium text-[#003ec7] mt-1 block">
                            {b.type === 'turf' ? b.sportOrCategory : 'Event'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsBellOpen(false);
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#003ec7] bg-[#e5eeff] transition-colors shadow-sm hover:scale-105 active:scale-95 overflow-hidden"
        >
          {userProfile?.imageUrl ? (
            <img
              src={getProfileImageUrl(userProfile.imageUrl)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-[#003ec7]" />
          )}
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e5eeff] z-50 py-1 overflow-hidden">
            <Link
              href="/profile"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#0b1c30] hover:bg-[#f8f9ff] transition-colors"
            >
              <User className="w-4 h-4 text-[#003ec7]" />
              Profile
            </Link>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-[#fff1f0] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
