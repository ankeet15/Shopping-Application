"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, Bell, X } from "lucide-react";
import { useUIStore, Toast } from "@/store/uiStore";

const toastStyles = {
  success: {
    bg: "bg-white",
    border: "border border-emerald-100",
    text: "text-stone-800",
    icon: <CheckCircle2 size={18} className="text-petal-sage" />,
    accent: "bg-petal-sage",
  },
  error: {
    bg: "bg-white",
    border: "border border-rose-100",
    text: "text-stone-800",
    icon: <AlertCircle size={18} className="text-petal-rose" />,
    accent: "bg-petal-rose",
  },
  info: {
    bg: "bg-white",
    border: "border border-sky-100",
    text: "text-stone-800",
    icon: <Info size={18} className="text-petal-sky" />,
    accent: "bg-petal-sky",
  },
  neutral: {
    bg: "bg-white",
    border: "border border-purple-100",
    text: "text-stone-800",
    icon: <Bell size={18} className="text-petal-lavender" />,
    accent: "bg-petal-lavender",
  },
};

export const PetalToast: React.FC<{ toast: Toast; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const style = toastStyles[toast.type] || toastStyles.neutral;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-[16px] shadow-card-hover ${style.bg} ${style.border} font-dm w-[320px] relative overflow-hidden`}
    >
      {/* Visual Accent Strip */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${style.accent}`} />

      {/* Icon */}
      <div className="flex-shrink-0 ml-1">{style.icon}</div>

      {/* Message */}
      <div className={`flex-1 text-sm font-medium leading-relaxed ${style.text}`}>
        {toast.message}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors duration-200"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export const PetalToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <PetalToast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
