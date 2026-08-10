"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email Address is required.");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return; 

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      toast.success(data.message || "Reset link sent! Check your inbox.", {
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
        duration: 3000,
      });

      // Redirect back to login after sending the link
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      toast.error(error.message || "Failed to process request.", {
        style: { border: '1px solid #ff4b4b', padding: '16px', color: '#0b1c30', background: '#ffffff' },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-12 font-sans bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2070')" }}
    >
      <div className="absolute inset-0 bg-[#0b1c30]/50 backdrop-blur-sm"></div>
      <Toaster position="top-center" reverseOrder={false} />

      <main className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative z-10">
        
        {/* Back Button */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[#434656] hover:text-[#003ec7] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <h1 className="font-extrabold text-3xl text-[#0b1c30] tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-base text-[#434656]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          
          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-[#434656] mb-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${error ? "text-red-500" : "text-[#737688]"}`} />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="name@example.in"
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg text-base text-[#0b1c30] placeholder:text-[#737688] focus:outline-none transition-colors ${
                  error 
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                    : "border-[#c3c5d9] focus:border-[#003ec7] focus:ring-1 focus:ring-[#003ec7]"
                }`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold text-lg py-3 px-6 rounded-lg shadow-sm transition-all duration-200 ${
              isSubmitting 
                ? "bg-[#003ec7]/70 cursor-not-allowed" 
                : "bg-[#003ec7] hover:shadow-[0_12px_32px_rgba(11,28,48,0.12)] hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </main>
    </div>
  );
}