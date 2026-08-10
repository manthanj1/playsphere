"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { User, Mail, Phone, Lock, X, AlertCircle, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import Cookies from 'js-cookie';

export default function SignUpPage() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    termsAccepted: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
      isValid = false;
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms of Service.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // UPDATED: Async handleSubmit for Custom Backend Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; 
    }

    setIsSubmitting(true); 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Save token to cookie
      Cookies.set('token', data.token, { expires: 7 });
      
      // Save user to local storage for UI state
      localStorage.setItem('playSphereUser', JSON.stringify(data.user));

      // Handle Success
      toast.success("Account created successfully! Redirecting...", {
        style: {
          border: '1px solid #c3c5d9',
          padding: '16px',
          color: '#0b1c30',
          background: '#ffffff',
        },
        iconTheme: {
          primary: '#003ec7',
          secondary: '#ffffff',
        },
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error: any) {
      console.error("Sign-up Error:", error);
      
      toast.error(error.message || "Failed to create account. Please try again.", {
        style: { border: '1px solid #ff4b4b', padding: '16px', color: '#0b1c30', background: '#ffffff' },
      });
      
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-12 font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLeaaohOQitQdYpGB_pMF3w5uVDxCakxtdkmJSupwPHZ-hXctZRKoyEsMDtumnt5VFJWuwH8OF5Qksn83xt3xnTRB4Utq3993lfKTLhD9HAB_Tvi_w4x6mfDDffCDeMnDmRNU30HE4ShvHFRnhbtT3jf5Nt_AgIjmQAAi-3aXgigQTWac3jtNA6Ug7jZiwGIB9B9gqu60aavgUbm3sfkyEGMhSYHIkfFHN1-XGRFd8Y9Z9ZJdmdDhfYw')" }}
    >
      <div className="absolute inset-0 bg-[#0b1c30]/50 backdrop-blur-sm"></div>

      <Toaster position="top-center" reverseOrder={false} />

      <main className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative z-10">
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="font-extrabold text-4xl md:text-5xl text-[#003ec7] italic tracking-tighter mb-2 font-serif">
            PlaySphere
          </h1>
          <p className="text-base text-[#434656]">
            Join the community and start playing.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.fullName ? "text-red-500" : "text-[#737688]"}`} />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Manthan Jotaniya"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.fullName 
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
              </div>
              {errors.fullName && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? "text-red-500" : "text-[#737688]"}`} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="manthanj@example.in"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.phone ? "text-red-500" : "text-[#737688]"}`} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.phone 
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
              </div>
              {errors.phone && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? "text-red-500" : "text-[#737688]"}`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737688] hover:text-[#0b1c30] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-start gap-1 mt-1.5 text-red-500 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div>
            <div className="flex items-center gap-2">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className={`w-4 h-4 text-[#003ec7] border rounded focus:ring-[#003ec7] cursor-pointer ${
                  errors.termsAccepted ? "border-red-500" : "border-[#c3c5d9]"
                }`}
              />
              <label htmlFor="termsAccepted" className="text-xs text-[#434656]">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#003ec7] hover:underline focus:outline-none"
                >
                  Terms of Service
                </button>
              </label>
            </div>
            {errors.termsAccepted && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.termsAccepted}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold text-lg py-3 px-6 rounded-lg shadow-sm transition-all duration-200 ${
              isSubmitting 
                ? "bg-[#003ec7]/70 cursor-not-allowed" 
                : "bg-[#003ec7] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-base text-[#434656] mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#003ec7] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </main>

      {/* Terms Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0b1c30]">Terms of Service</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto text-sm text-[#434656] space-y-4">
              <p>
                <strong>1. Acceptance of Terms</strong><br/>
                By accessing and using PlaySphere, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                <strong>2. Booking and Cancellations</strong><br/>
                All turf and event bookings are subject to availability. Cancellations must be made at least 24 hours in advance for a full refund.
              </p>
              <p>
                <strong>3. Code of Conduct</strong><br/>
                Users are expected to maintain good sportsmanship and adhere to the rules established by individual turf owners and event organizers.
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#003ec7] text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}