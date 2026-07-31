"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DynamicText from "../kokonutui/dynamic-text";

interface LoadingProps {
  duration?: number;
  onComplete?: () => void;
  inline?: boolean;
}

export default function Loading({
  duration = 2000,
  onComplete,
  inline = false,
}: LoadingProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!show) return null;

  if (inline) {
    return (
      <div className="flex items-center justify-center p-8 bg-[#0A0A0C]">
        <DynamicText />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0C]"
        >
          <DynamicText />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
