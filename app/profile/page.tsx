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
  Camera
} from "lucide-react";
import Cookies from "js-cookie";
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

  // Save changes to state and localStorage
  const handleSaveChanges = () => {
    if (editFormData) {
      setUserData(editFormData);
      localStorage.setItem("playSphereUser", JSON.stringify(editFormData));
      setIsEditing(false);
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
            <div className="bg-white rounded-2xl border border-[#c3c5d9] p-6 shadow-[0_4px_20px_rgba(11,28,48,0.05)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#dce9ff] to-transparent opacity-50 z-0"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Profile Photo Area */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-[#e5eeff] shadow-md mb-4 relative flex items-center justify-center group/avatar">
                  {displayData.profilePhoto ? (
                    <img src={getProfileImageUrl(displayData.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#e5eeff] text-[#003ec7] font-bold text-3xl">
                      {getInitials(displayData.name)}
                    </div>
                  )}
                  
                  {isEditing && (
                    <>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity"
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
                  <div className="w-full space-y-3 mb-6">
                    <input 
                      type="text"
                      name="name"
                      value={editFormData?.name || ""}
                      onChange={handleInputChange}
                      className="w-full text-center text-xl font-bold font-serif text-[#0b1c30] border-b-2 border-[#003ec7] focus:outline-none bg-transparent pb-1"
                      placeholder="Your Name"
                    />
                    <textarea 
                      name="bio"
                      value={editFormData?.bio || ""}
                      onChange={handleInputChange}
                      className="w-full text-center text-sm text-[#434656] border-2 border-[#c3c5d9] focus:border-[#003ec7] rounded-lg p-2 focus:outline-none resize-none bg-white/50"
                      rows={2}
                      placeholder="Write a short bio..."
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold font-serif text-[#0b1c30] mb-1">{userData.name}</h1>
                    <p className="text-base text-[#434656] mb-6">{userData.bio}</p>
                  </>
                )}
                
                {/* Stats */}
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
                {/* Email (Read-only even in edit mode usually, but made editable for completeness) */}
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#737688] shrink-0" />
                  {isEditing ? (
                    <input type="email" name="email" value={editFormData?.email || ""} onChange={handleInputChange} className="flex-1 text-sm border-b border-[#c3c5d9] focus:border-[#003ec7] focus:outline-none bg-transparent pb-1" />
                  ) : (
                    <span className="text-base truncate">{userData.email}</span>
                  )}
                </li>
                
                {/* Phone */}
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#737688] shrink-0" />
                  {isEditing ? (
                    <input type="text" name="phone" value={editFormData?.phone || ""} onChange={handleInputChange} className="flex-1 text-sm border-b border-[#c3c5d9] focus:border-[#003ec7] focus:outline-none bg-transparent pb-1" />
                  ) : (
                    <span className="text-base">{userData.phone}</span>
                  )}
                </li>
                
                {/* Location */}
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#737688] shrink-0" />
                  {isEditing ? (
                    <input type="text" name="location" value={editFormData?.location || ""} onChange={handleInputChange} className="flex-1 text-sm border-b border-[#c3c5d9] focus:border-[#003ec7] focus:outline-none bg-transparent pb-1" />
                  ) : (
                    <span className="text-base">{userData.location}</span>
                  )}
                </li>
              </ul>

              {/* Edit / Save Action Buttons */}
              <div className="mt-6 flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveChanges}
                      className="flex-1 bg-[#003ec7] text-white font-semibold text-sm py-3 px-4 rounded-lg hover:bg-[#0038b6] transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button 
                      onClick={handleEditToggle}
                      className="flex-1 border-2 border-[#c3c5d9] text-[#434656] font-semibold text-sm py-3 px-4 rounded-lg hover:bg-[#f8f9ff] transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className="w-full border-2 border-[#003ec7] text-[#003ec7] font-semibold text-base py-3 px-6 rounded-lg hover:bg-[#dce9ff]/50 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Logout Button (Hide when editing to avoid accidental clicks) */}
            {!isEditing && (
              <button 
                onClick={handleLogout}
                className="w-full bg-[#ffdad6] text-[#93000a] font-semibold text-base py-3 px-6 rounded-lg hover:bg-[#ba1a1a] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-5 h-5" />
                Logout
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
                  <Link href="#" className="text-[#003ec7] font-semibold text-sm hover:underline">
                    View All
                  </Link>
                }
              />
              
              <div className="flex flex-col gap-4">
                {bookings.filter(b => {
                  const bookingDate = new Date(b.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return bookingDate >= today;
                }).length > 0 ? (
                  bookings.filter(b => {
                    const bookingDate = new Date(b.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return bookingDate >= today;
                  }).map((booking, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#c3c5d9] p-0 shadow-[0_4px_20px_rgba(11,28,48,0.05)] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] transition-shadow hover:-translate-y-1 transform duration-200 overflow-hidden flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-48 sm:h-auto relative bg-[#e5eeff] flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-[#003ec7] opacity-20 absolute" />
                        <div className="absolute top-3 left-3 bg-[#003ec7] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {booking.type === "turf" ? booking.sportOrCategory : "Event"}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold font-serif text-[#0b1c30] mb-1">{booking.itemName}</h3>
                          <p className="text-[#434656] text-base flex items-center gap-1.5 mb-4">
                            <Calendar className="w-4 h-4" /> {new Date(booking.date).toLocaleDateString()}{booking.slots?.length ? ` • ${booking.slots.join(", ")}` : ""}
                          </p>
                          <p className="text-sm text-[#434656]">{booking.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/booking-success?booking_id=${booking.bookingId || (booking as any).id}`} className="bg-[#003ec7] hover:bg-[#0038b6] transition-colors text-white font-semibold text-sm py-2 px-4 rounded-lg flex-1 text-center flex items-center justify-center">View</Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-[#c3c5d9] p-6 shadow-[0_4px_20px_rgba(11,28,48,0.05)] text-center">
                    <p className="text-[#434656]">You have no upcoming bookings yet. Book a turf or event to see it here.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}