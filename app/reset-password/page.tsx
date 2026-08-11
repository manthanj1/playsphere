"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { showToast } from "@/lib/toast";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
    setEmail(params.get("email") || "");
  }, []);

  useEffect(() => {
    if (!token || !email) {
      showToast("Invalid or missing reset token.", "error");
    }
  }, [token, email]);

  const validateForm = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!password) {
      setError("Password is required.");
      return false;
    } else if (!passwordRegex.test(password)) {
      setError("Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!validateForm()) return; 

    setIsSubmitting(true);

    try {
      const data = await authService.resetPassword({ email, token, newPassword: password });

      showToast("Password has been reset successfully!", "success");

      // Redirect back to login
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      showToast(error.message || "Failed to reset password.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-12 font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/placeholders/auth-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#0b1c30]/50 backdrop-blur-sm"></div>
      <Toaster position="top-center" reverseOrder={false} />

      <main className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative z-10">
        
        <div className="mb-8">
          <h1 className="font-extrabold text-3xl text-[#0b1c30] tracking-tight mb-2">
            Set New Password
          </h1>
          <p className="text-base text-[#434656]">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* New Password */}
          <div>
            <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${error ? "text-red-500" : "text-[#737688]"}`} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                  error ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
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
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${error ? "text-red-500" : "text-[#737688]"}`} />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                  error ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                }`}
              />
            </div>
            {error && (
              <div className="flex items-start gap-1 mt-1.5 text-red-500 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !token || !email}
            className={`w-full text-white font-bold text-lg py-3 px-6 rounded-lg shadow-sm transition-all duration-200 ${
              (isSubmitting || !token || !email)
                ? "bg-[#003ec7]/70 cursor-not-allowed" 
                : "bg-[#003ec7] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </main>
    </div>
  );
}
