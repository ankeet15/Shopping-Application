"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { addToast } = useUIStore();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  // If already logged in as customer, redirect to homepage/dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast("Please fill in all fields.", "error");
      return;
    }

    setLoadingLocal(true);
    try {
      if (isRegister) {
        if (!name.trim()) {
          addToast("Please enter your name.", "error");
          setLoadingLocal(false);
          return;
        }

        // Firebase Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(userCredential.user, { displayName: name.trim() });
        
        const customerUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || email.trim(),
          name: name.trim(),
          role: "customer" as const,
        };
        setUser(customerUser);
        addToast(`Welcome to PETAL, ${name.trim()}!`, "success");
      } else {
        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const customerUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || email.trim(),
          name: userCredential.user.displayName || "Valued Customer",
          role: "customer" as const,
        };
        setUser(customerUser);
        addToast(`Welcome back, ${customerUser.name}!`, "success");
      }
      router.push("/");
    } catch (error: any) {
      console.error("Firebase auth error:", error);
      let errMsg = "Authentication failed. Please check your credentials.";
      if (error.code === "auth/email-already-in-use") {
        errMsg = "This email is already in use.";
      } else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        errMsg = "Incorrect email or password.";
      } else if (error.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password credential.";
      } else if (error.code === "auth/weak-password") {
        errMsg = "Password should be at least 6 characters.";
      }
      addToast(errMsg, "error");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-petal-canvas font-dm py-16 flex items-center justify-center select-none text-left">
        <div className="w-full max-w-[440px] px-6">
          <div className="bg-white border border-petal-border rounded-section shadow-card-hover p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-petal-rose via-petal-lavender to-petal-sky" />

            {/* Header section */}
            <div className="mb-8 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-petal-text-tertiary">
                {isRegister ? "Join the Circle" : "Welcome Back"}
              </span>
              <h1 className="text-3xl font-bold font-playfair text-petal-text-primary mt-1">
                {isRegister ? "create an " : "sign in to " }
                <span className="italic font-normal text-petal-lavender">
                  {isRegister ? "account" : "petal"}
                </span>
              </h1>
            </div>

            {/* Switch tabs */}
            <div className="flex border-b border-stone-100 mb-6 text-xs font-bold uppercase tracking-widest">
              <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 pb-3 transition-colors border-b-2 text-center ${
                  !isRegister
                    ? "border-petal-lavender text-petal-text-primary"
                    : "border-transparent text-stone-400 hover:text-petal-text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 pb-3 transition-colors border-b-2 text-center ${
                  isRegister
                    ? "border-petal-lavender text-petal-text-primary"
                    : "border-transparent text-stone-400 hover:text-petal-text-primary"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required={isRegister}
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 border border-petal-border rounded-input pl-11 pr-4 py-3 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/5 transition-all font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-petal-border rounded-input pl-11 pr-4 py-3 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-petal-text-primary mb-1.5 flex justify-between">
                  <span>Password</span>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => addToast("Password reset feature is disabled for this prototype.", "info")}
                      className="text-[9px] lowercase tracking-normal text-petal-lavender hover:underline font-bold"
                    >
                      Forgot?
                    </button>
                  )}
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-petal-border rounded-input pl-11 pr-12 py-3 text-xs text-petal-text-primary placeholder-petal-text-tertiary focus:outline-none focus:border-petal-lavender focus:ring-4 focus:ring-petal-lavender/5 transition-all font-medium"
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
                disabled={loadingLocal}
                className="w-full bg-petal-rose text-white text-xs font-bold py-3.5 rounded-button shadow-md hover:bg-rose-500 hover:shadow-btn-active active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <span>{loadingLocal ? "Processing..." : isRegister ? "Create Account" : "Access Sanctuary"}</span>
                {!loadingLocal && <ArrowRight size={14} />}
              </button>
            </form>

            {/* Portal Switch Link */}
            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Store Administrator?{" "}
                <button
                  onClick={() => router.push("/login/admin")}
                  className="text-petal-lavender hover:underline underline-offset-2 ml-1"
                >
                  Admin Portal
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
