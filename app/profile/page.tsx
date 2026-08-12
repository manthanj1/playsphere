"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Pencil, 
  Mail, 
  Phone, 
  MapPin, 
  LogOut, 
  Calendar, 
  Trophy, 
  User,
  Check,
  X,
  Camera,
  CreditCard
} from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { paymentService } from "@/services/paymentService";

import Navbar from "@/components/Navbar";
import PageContainer from "@/components/PageContainer";
import SectionHeader from "@/components/SectionHeader";
import { getConfirmedBooking } from "@/lib/booking";

// Define the shape of our user data
interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  bookingsCount: number;
  tournamentsCount: number;
  profilePhoto?: string;
}

interface BookingSummary {
  bookingId?: string;
  type: "turf" | "event";
  itemId: string;
  itemName: string;
  sportOrCategory: string;
  city: string;
  date: string;
  slots: string[];
  tierId?: string;
  tierName?: string;
  amount: number;
  platformFee: number;
  total: number;
  location: string;
  createdAt?: string;
  imageUrl?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "P";
}

export default function ProfilePage() {
  const router = useRouter();
  
  // Data states
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("playSphereUser");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || "Player One",
          email: parsedUser.email || "player@example.com",
          phone: parsedUser.phone || "+91 XXXXX XXXXX",
          bio: parsedUser.bio || "PlaySphere Athlete",
          location: parsedUser.location || parsedUser.city || "Gujarat, India",
          bookingsCount: parsedUser.bookingsCount || 0,
          tournamentsCount: parsedUser.tournamentsCount || 0,
          profilePhoto: parsedUser.imageUrl || parsedUser.profilePhoto || "",
        });
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }

    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsLoading(false);
        router.push("/login");
        return;
      }

      const buildProfile = (backendUser: any | null) => {
        const defaultName = backendUser?.name || "Player One";
        return {
          name: defaultName,
          email: backendUser?.email || "player@example.com",
          phone: backendUser?.phone || "+91 XXXXX XXXXX",
          bio: backendUser?.bio || `Welcome back, ${defaultName}`,
          location: backendUser?.location || backendUser?.city || "Gujarat, India",
          bookingsCount: backendUser?.bookingsCount ?? 0,
          tournamentsCount: backendUser?.tournamentsCount ?? 0,
          profilePhoto: backendUser?.imageUrl || "",
        };
      };

      try {
        const response = await authService.getMe();
        const backendUser = response?.user || null;
        
        // If we want to sync the frontend data to backend on page load:
        const profilePayload = {
          name: backendUser?.name || "Player One",
          email: backendUser?.email || "",
          phone: backendUser?.phone || "",
          location: "Gujarat, India",
          city: "Ahmedabad",
          bookingsCount: backendUser?.bookingsCount || 0,
          tournamentsCount: backendUser?.tournamentsCount || 0,
          imageUrl: backendUser?.imageUrl || "",
        };
        
        const syncResponse = await authService.updateProfile(profilePayload);
        
        const updatedUser = syncResponse?.user || backendUser;
        const profileData = buildProfile(updatedUser);

        setUserData(profileData);
        localStorage.setItem('playSphereUser', JSON.stringify(profileData));

        if (updatedUser?.email) {
          const bookingResponse = await paymentService.getBookings();
          const userBookings = bookingResponse?.bookings ?? [];
          setBookings(userBookings);
        }
      } catch (error) {
        console.error('Failed to load backend profile', error);
        if (error instanceof Error && error.message.includes("Unauthorized")) {
          Cookies.remove("token");
          localStorage.removeItem("playSphereUser");
          router.push("/login");
        } else {
          const profileData = buildProfile(null);
          setUserData(profileData);
          localStorage.setItem('playSphereUser', JSON.stringify(profileData));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    Cookies.remove("token");
    localStorage.removeItem("playSphereUser");
    router.push("/login");
  };

  // Toggle edit mode and initialize the form data
  const handleEditToggle = () => {
    if (!isEditing && userData) {
      setEditFormData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };

  // Handle photo upload and preview
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editFormData) {
      try {
        const formData = new FormData();
        formData.append("photo", file);
        
        const data = await authService.updateProfilePhoto(formData);
        if (data.imageUrl) {
          setEditFormData({
            ...editFormData,
            profilePhoto: data.imageUrl
          });
        }
      } catch (err) {
        console.error("Photo upload failed", err);
      }
    }
  };

  const getProfileImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url && !url.startsWith("http") && !url.startsWith("data:")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';
      return `${baseUrl}${url}`;
    }
    return url;
  };

  // Save changes to state, localStorage, and backend
  const handleSaveChanges = async () => {
    if (editFormData) {
      setUserData(editFormData);
      localStorage.setItem("playSphereUser", JSON.stringify(editFormData));
      setIsEditing(false);

      try {
        await authService.updateProfile({
          name: editFormData.name,
          phone: editFormData.phone,
          bio: editFormData.bio,
          imageUrl: editFormData.profilePhoto
        });
      } catch (err) {
        console.error("Failed to save profile to backend", err);
      }
    }
  };

  if (isLoading || !userData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8f9ff] text-[#003ec7]">
        <div className="w-8 h-8 border-4 border-[#003ec7] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-semibold">Loading Profile...</p>
      </div>
    );
  }

  // Determine which data to display based on whether we are in edit mode
  const displayData = isEditing && editFormData ? editFormData : userData;

  const upcomingBookings = bookings.filter(b => {
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

  const totalSpent = bookings.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans min-h-screen pb-6 md:pb-0 antialiased">
      
      <Navbar logoAsSpan={true} showProfileIcon={false} />
      
      <PageContainer className="py-6 md:py-10">
        
        {/* Dynamic Back Button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#434656] hover:text-[#003ec7] font-medium transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Profile Sidebar / Header */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* User Identity Card */}
            <div className="bg-white rounded-[2rem] border border-[#e5eeff] shadow-[0_8px_30px_rgba(11,28,48,0.04)] relative overflow-hidden group">
              {/* Cover Banner */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#003ec7] to-[#1a56e0] z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center px-6 pt-12 pb-8 mt-4">
                
                {/* Profile Photo Area */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-white bg-white shadow-lg mb-5 relative flex items-center justify-center group/avatar">
                  {displayData.profilePhoto ? (
                    <img src={getProfileImageUrl(displayData.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e5eeff] to-[#dce9ff] text-[#003ec7] font-bold text-4xl">
                      {getInitials(displayData.name)}
                    </div>
                  )}
                  
                  {isEditing && (
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-[2px]"
                      >
                        <Pencil className="w-6 h-6" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Name & Bio */}
                {isEditing ? (
                  <div className="w-full space-y-4 mb-8">
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#737688]" />
                      <input 
                        type="text"
                        name="name"
                        value={editFormData?.name || ""}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold text-[#0b1c30] border border-[#c3c5d9] focus:border-[#003ec7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#003ec7]/10 transition-all bg-[#f8f9ff]"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="relative">
                      <Pencil className="w-5 h-5 absolute left-4 top-3.5 text-[#737688]" />
                      <textarea 
                        name="bio"
                        value={editFormData?.bio || ""}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 text-sm font-medium text-[#434656] border border-[#c3c5d9] focus:border-[#003ec7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#003ec7]/10 transition-all bg-[#f8f9ff] resize-none"
                        rows={2}
                        placeholder="Write a short bio..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold font-serif text-[#0b1c30] mb-2">{userData.name}</h1>
                    <p className="text-[11px] font-bold text-[#003ec7] uppercase tracking-widest mb-3 bg-[#e5eeff] px-3 py-1 rounded-full">Athlete</p>
                    <p className="text-sm text-[#434656] mb-8 leading-relaxed max-w-[250px]">{userData.bio}</p>
                  </>
                )}
                
                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-4 border-t border-[#f0f4ff] pt-6">
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f8f9ff] hover:bg-[#e5eeff] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#003ec7]/10 flex items-center justify-center mb-2">
                       <Calendar className="w-4 h-4 text-[#003ec7]" />
                    </div>
                    <span className="block text-2xl font-black text-[#0b1c30]">{upcomingBookings.length}</span>
                    <span className="text-[10px] font-bold text-[#737688] uppercase tracking-widest mt-1">Upcoming</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f8f9ff] hover:bg-[#e5eeff] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#003ec7]/10 flex items-center justify-center mb-2">
                       <CreditCard className="w-4 h-4 text-[#003ec7]" />
                    </div>
                    <span className="block text-2xl font-black text-[#0b1c30]">₹{totalSpent.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-[#737688] uppercase tracking-widest mt-1">Total Spent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-[2rem] border border-[#e5eeff] p-6 sm:p-8 shadow-[0_8px_30px_rgba(11,28,48,0.04)]">
              <h2 className="text-lg font-bold text-[#0b1c30] mb-6 flex items-center gap-2">
                 <User className="w-5 h-5 text-[#003ec7]" /> Contact Info
              </h2>
              <ul className="flex flex-col gap-5">
                {/* Email (Read-only) */}
                <li className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#f8f9ff] flex items-center justify-center text-[#737688] group-hover:bg-[#e5eeff] group-hover:text-[#003ec7] transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#737688] uppercase tracking-wider mb-0.5">Email Address</p>
                    <span className="text-sm font-semibold text-[#0b1c30] block truncate">{displayData.email}</span>
                  </div>
                </li>
                
                {/* Phone */}
                <li className="flex items-center gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#f8f9ff] flex items-center justify-center text-[#737688] group-hover:bg-[#e5eeff] group-hover:text-[#003ec7] transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#737688] uppercase tracking-wider mb-0.5">Phone Number</p>
                    {isEditing ? (
                      <input type="text" name="phone" value={editFormData?.phone || ""} onChange={handleInputChange} className="w-full text-sm font-semibold text-[#0b1c30] border-b-2 border-[#003ec7] focus:outline-none bg-transparent py-1" />
                    ) : (
                      <span className="text-sm font-semibold text-[#0b1c30]">{displayData.phone}</span>
                    )}
                  </div>
                </li>
              </ul>

              {/* Edit / Save Action Buttons */}
              <div className="mt-8 flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveChanges}
                      className="flex-1 bg-[#003ec7] text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-[#0038b6] hover:shadow-lg hover:shadow-[#003ec7]/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button 
                      onClick={handleEditToggle}
                      className="flex-1 bg-[#f8f9ff] text-[#434656] font-bold text-sm py-3 px-4 rounded-xl hover:bg-[#e5eeff] hover:text-[#003ec7] transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className="w-full bg-[#f8f9ff] text-[#003ec7] font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-[#e5eeff] transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Logout Button (Hide when editing to avoid accidental clicks) */}
            {!isEditing && (
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full bg-[#fff1f0] text-[#e11d48] font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-[#ffe4e1] transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-8 flex flex-col gap-8 mt-8 md:mt-0">
            
            <section>
              <SectionHeader 
                title="Upcoming Bookings"
                className="mb-6"
                actions={
                  upcomingBookings.length > 2 && (
                    <button 
                      onClick={() => setShowAllBookings(!showAllBookings)}
                      className="text-[#003ec7] font-semibold text-sm hover:underline focus:outline-none"
                    >
                      {showAllBookings ? "Show Less" : "View All"}
                    </button>
                  )
                }
              />
              
              <div className={`flex flex-col gap-4 ${showAllBookings ? 'max-h-[500px] overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#f0f4ff] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#003ec7]/80 hover:[&::-webkit-scrollbar-thumb]:bg-[#003ec7] [&::-webkit-scrollbar-thumb]:rounded-full transition-all' : ''}`}>
                {(() => {
                  const visibleBookings = showAllBookings ? upcomingBookings : upcomingBookings.slice(0, 2);

                  return upcomingBookings.length > 0 ? (
                    visibleBookings.map((booking, idx) => (
                      <div key={idx} className="bg-white rounded-[2rem] border border-[#e5eeff] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#dce9ff] transition-all hover:-translate-y-1 duration-300 overflow-hidden flex flex-col sm:flex-row shrink-0 group">
                        <div className="sm:w-2/5 h-48 sm:h-auto relative bg-gradient-to-br from-[#f0f4ff] to-[#e5eeff] flex flex-col items-center justify-center p-0 overflow-hidden">
                          <div className="absolute inset-0 bg-[#003ec7] opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-20"></div>
                          {booking.imageUrl ? (
                            <img src={booking.imageUrl} alt={booking.itemName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <>
                              {booking.type === "turf" ? (
                                 <Trophy className="w-24 h-24 text-[#003ec7] opacity-10 absolute -right-4 -bottom-4 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                 <Calendar className="w-24 h-24 text-[#003ec7] opacity-10 absolute -right-4 -bottom-4 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                              )}
                              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 text-[#003ec7]">
                                 {booking.type === "turf" ? <Trophy className="w-8 h-8" /> : <Calendar className="w-8 h-8" />}
                              </div>
                            </>
                          )}
                          <span className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md text-[#003ec7] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            {booking.type === "turf" ? booking.sportOrCategory : "Event"}
                          </span>
                        </div>
                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                              <h3 className="text-xl font-bold font-serif text-[#0b1c30] group-hover:text-[#003ec7] transition-colors">{booking.itemName}</h3>
                              <span className="bg-[#f0f4ff] text-[#003ec7] text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider whitespace-nowrap self-start">
                                {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0">
                                 <Calendar className="w-4 h-4 text-[#737688]" />
                              </div>
                              <p className="text-sm font-semibold text-[#434656]">
                                {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                {booking.slots?.length ? ` • ${booking.slots.join(", ")}` : ""}
                              </p>
                            </div>
                            
                            <div className="flex items-start gap-3 mb-6">
                              <div className="w-8 h-8 rounded-full bg-[#f8f9ff] flex items-center justify-center shrink-0 mt-0.5">
                                 <MapPin className="w-4 h-4 text-[#737688]" />
                              </div>
                              <p className="text-sm font-medium text-[#737688] leading-relaxed">{booking.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-6 border-t border-[#f0f4ff]">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-[#737688] uppercase tracking-widest mb-0.5">Total Paid</span>
                              <span className="text-lg font-black text-[#0b1c30]">₹{booking.total}</span>
                            </div>
                            <Link href={`/booking-success?booking_id=${booking.bookingId || (booking as any).id}`} className="bg-[#003ec7] hover:bg-[#0038b6] hover:shadow-lg hover:shadow-[#003ec7]/30 transition-all text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 group/btn">
                              View Ticket <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-[2rem] border border-[#e5eeff] p-12 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-[#f0f4ff] rounded-2xl flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-[#003ec7] opacity-50" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0b1c30] mb-2">No upcoming bookings</h3>
                      <p className="text-[#434656]">You do not have any upcoming bookings at the moment.</p>
                      <Link href="/" className="mt-6 inline-flex items-center gap-2 bg-[#003ec7] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002a8f] transition-colors">
                        Explore Venues
                      </Link>
                    </div>
                  );
                })()}
              </div>
            </section>
          </div>
        </div>
      </PageContainer>

      {/* Logout Confirmation Modal */}
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