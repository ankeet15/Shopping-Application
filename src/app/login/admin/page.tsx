"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { addToast } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in all fields.", "error");
      return;
    }

    setLoading(true);
    // Mimic database check matching the exact user settings requested
    setTimeout(() => {
      const emailTrim = email.trim().toLowerCase();
      if (emailTrim === "ankeet15@gmail.com" && password === "ankeet15") {
        const adminUser = {
          uid: "admin-root-15",
          email: "ankeet15@gmail.com",
          name: "Ankit (Admin)",
          role: "admin" as const,
        };
        setUser(adminUser);
        addToast("Welcome back, Commander. Studio access granted.", "success");
        router.push("/admin");
      } else {
        addToast("Invalid administrator credentials.", "error");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas font-dm py-16 flex items-center justify-center select-none text-left">
        <div className="w-full max-w-[440px] px-6">
          <div className="bg-white border border-petal-border rounded-section shadow-card-hover p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top warning/accent gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-rose-400 to-amber-500" />

            {/* Header section */}
            <div className="mb-8 text-center sm:text-left flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-petal-lavender flex items-center gap-1">
                  <ShieldCheck size={12} /> Studio Command Center
                </span>
                <h1 className="text-3xl font-bold font-playfair text-petal-text-primary mt-1">
                  admin <span className="italic font-normal text-petal-rose">portal</span>
                </h1>
              </div>
            </div>

            {/* Warning indicator */}
            <div className="bg-stone-50 border border-stone-100 rounded-card p-4.5 mb-6 text-[11px] text-stone-500 font-medium leading-relaxed">
              This interface is restricted to PETAL Studio staff. Customer sessions should authenticate through standard client login nodes.
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="ankeet15@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-petal-border rounded-input pl-11 pr-4 py-3 text-xs text-petal-text-primary placeholder-stone-300 focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5 flex justify-between">
                  <span>Secret Key</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-petal-border rounded-input pl-11 pr-12 py-3 text-xs text-petal-text-primary placeholder-stone-300 focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/5 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-petal-text-primary text-white text-xs font-bold py-3.5 rounded-button shadow-md hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <span>{loading ? "Authorizing Staff Node..." : "Initiate Terminal Connection"}</span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            {/* Back switch */}
            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Returning Customer?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-petal-rose hover:underline underline-offset-2 ml-1"
                >
                  Standard Log In
                </button>
              </span>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
