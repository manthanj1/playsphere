"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter(); // Initialize the router
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required to fill.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required to fill.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; 
    }

    // Trigger success toast
    toast.success("Welcome back to the game!", {
      style: { border: '1px solid #c3c5d9', padding: '16px', color: '#0b1c30', background: '#ffffff' },
      iconTheme: { primary: '#003ec7', secondary: '#ffffff' },
    });

    // Redirect to Select City page after a short delay
    setTimeout(() => {
      router.push("/select-city");
    }, 1500);
  };

  return (
    <div className="h-screen w-full bg-[#f8f9ff] text-[#0b1c30] antialiased overflow-hidden flex items-center justify-center font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="bg-cover bg-center bg-no-repeat w-full h-full object-cover" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLeaaohOQitQdYpGB_pMF3w5uVDxCakxtdkmJSupwPHZ-hXctZRKoyEsMDtumnt5VFJWuwH8OF5Qksn83xt3xnTRB4Utq3993lfKTLhD9HAB_Tvi_w4x6mfDDffCDeMnDmRNU30HE4ShvHFRnhbtT3jf5Nt_AgIjmQAAi-3aXgigQTWac3jtNA6Ug7jZiwGIB9B9gqu60aavgUbm3sfkyEGMhSYHIkfFHN1-XGRFd8Y9Z9ZJdmdDhfYw')" }}
        />
        <div className="absolute inset-0 bg-[#0b1c30]/40 mix-blend-multiply"></div>
      </div>

      {/* Login Card */}
      <main className="relative z-10 w-full max-w-md px-4 md:px-0">
        <div className="bg-[#f8f9ff]/85 backdrop-blur-md rounded-2xl shadow-[0_12px_32px_rgba(11,28,48,0.12)] border border-[#c3c5d9]/30 p-8 md:p-10 flex flex-col gap-8">
          
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-serif text-4xl md:text-5xl italic font-black text-[#003ec7] tracking-tighter">
              PlaySphere
            </h1>
            <p className="text-base text-[#434656]">
              Sign in to join the action.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#0b1c30]" htmlFor="email">
                  Email Address
                </label>
                <input 
                  id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                  placeholder="player@example.com" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /><span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#0b1c30]" htmlFor="password">Password</label>
                  <Link href="/forgot-password" className="text-sm text-[#003ec7] font-medium hover:text-[#0038b6] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input 
                  id="password" name="password" type="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                  }`}
                />
                {errors.password && (
                  <div className="flex items-center gap-1 mt-0.5 text-red-500 text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /><span>{errors.password}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button type="submit" className="w-full bg-[#003ec7] hover:bg-[#0038b6] text-white font-bold text-lg py-3 px-6 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                Sign In
                <LogIn className="w-5 h-5" />
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#c3c5d9]"></div>
                <span className="flex-shrink-0 mx-4 text-sm font-semibold text-[#434656] uppercase tracking-wider">OR</span>
                <div className="flex-grow border-t border-[#c3c5d9]"></div>
              </div>
              
              <Link href="/signup" className="w-full bg-transparent border-2 border-[#003ec7] text-[#003ec7] hover:bg-[#d3e4fe]/30 font-semibold text-sm py-3 px-6 rounded-lg transition-all active:scale-95 flex items-center justify-center">
                Create an account
              </Link>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}