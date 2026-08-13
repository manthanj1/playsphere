"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Bell, LogOut, Loader2, Calendar } from "lucide-react";
import { authService } from "@/services/authService";
import { paymentService } from "@/services/paymentService";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
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
          const response = await authService.sync();
          
          if (response?.user) {
             setUserProfile(prev => ({
               name: response.user.name || response.user.fullName || "User",
               imageUrl: response.user.imageUrl || response.user.profilePhotoUrl || "",
               email: response.user.email
             }));
             localStorage.setItem("playSphereUser", JSON.stringify(response.user));
          }
          
          // Fetch bookings
          setIsLoadingBookings(true);
          const bookingRes = await paymentService.getBookings();
          const allBookings = bookingRes?.bookings || [];
          const upcomingBookings = allBookings.filter((b: any) => {
            if (b.status === 'CANCELLED') return false;
            
            const now = new Date();
            if (b.slots && b.slots.length > 0) {
              let isFuture = false;
              const d = new Date(b.date);
              const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              
              for (const slot of b.slots) {
                const parts = slot.split(" - ");
                const endTimeStr = parts.length > 1 ? parts[1].trim() : null;
                if (endTimeStr) {
                  const slotEndDate = new Date(`${dateStr}T${endTimeStr}:00`);
                  if (slotEndDate > now) {
                    isFuture = true;
                    break;
                  }
                }
              }
              return isFuture;
            } else {
              const bookingDateEnd = new Date(b.date);
              bookingDateEnd.setHours(23, 59, 59, 999);
              return bookingDateEnd > now;
            }
          });
          setBookings(upcomingBookings);
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';
      return `${baseUrl}${url}`;
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
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#e5eeff] z-50 overflow-hidden transform animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-gradient-to-r from-[#003ec7] to-[#1a56e0] px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">Upcoming Bookings</h3>
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-inner">
                {bookings.length} New
              </span>
            </div>
            <div className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c3c5d9] [&::-webkit-scrollbar-thumb]:rounded-full bg-[#fcfdff]">
              {isLoadingBookings ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#003ec7]" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#e5eeff] rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-[#003ec7] opacity-50" />
                  </div>
                  <p className="text-sm font-medium text-[#737688]">No upcoming bookings.</p>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {bookings.map((b, i) => (
                    <li key={i} className="group border-b border-[#f0f4ff] last:border-0 hover:bg-[#f8f9ff] transition-colors relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#003ec7] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                      <Link 
                        href={`/booking-success?booking_id=${b.bookingId || (b as any).id}`}
                        onClick={() => setIsBellOpen(false)}
                        className="p-4 flex items-start gap-4 block"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#003ec7] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0b1c30] text-sm truncate group-hover:text-[#003ec7] transition-colors">{b.itemName}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-[#737688]">
                            <span className="flex items-center gap-1">
                              {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            {b.slots?.length > 0 && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[#c3c5d9]"></span>
                                <span className="truncate">{b.slots[0]}</span>
                              </>
                            )}
                          </div>
                          <div className="mt-2.5 flex">
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#e5eeff] text-[#003ec7] border border-[#dce9ff]">
                              {b.type === 'turf' ? b.sportOrCategory : 'Event'}
                            </span>
                          </div>
                        </div>
                      </Link>
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
                setShowLogoutConfirm(true);
              }}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-[#fff1f0] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1c30]/40">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col gap-3 min-w-[320px] transform transition-all animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-xl text-[#0b1c30]">Confirm Logout</h3>
            <p className="text-[#434656] text-sm mb-4">Are you sure you want to log out of PlaySphere?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 text-sm font-bold rounded-xl text-[#434656] bg-[#f4f7fb] hover:bg-[#e5eeff] hover:text-[#003ec7] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
