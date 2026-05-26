import React from "react";
import { Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center bg-white border border-petal-border rounded-button overflow-hidden h-10 px-2 select-none ${className}`}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-500 hover:bg-petal-subtle hover:text-petal-lavender disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-stone-500 transition-colors duration-150"
      >
        <Minus size={14} />
      </motion.button>

      <span className="w-8 text-center text-sm font-semibold font-dm text-petal-text-primary">
        {value}
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-500 hover:bg-petal-subtle hover:text-petal-lavender disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-stone-500 transition-colors duration-150"
      >
        <Plus size={14} />
      </motion.button>
    </div>
  );
};
