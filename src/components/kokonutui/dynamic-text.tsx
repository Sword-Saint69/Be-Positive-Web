"use client";

/**
 * @author: @dorianbaffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Greeting {
  text: string;
  language: string;
}

const greetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "こんにちは", language: "Japanese" },
  { text: "നമസ്കാരം", language: "Malayalam" },
];

const DynamicText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Animation variants for the text
  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  if (!mounted) return null;

  return (
    <section
      aria-label="Rapid greetings in different languages"
      className="flex min-h-[200px] items-center justify-center gap-1 p-4"
      style={{ fontFamily: "'Chilanka', cursive" }}
    >
      <div className="relative flex h-16 w-60 items-center justify-center overflow-visible">
        <AnimatePresence mode="popLayout">
          <motion.div
            animate={textVariants.visible}
            aria-live="off"
            className="absolute flex items-center gap-2 font-medium text-3xl text-white"
            exit={textVariants.exit}
            initial={textVariants.hidden}
            key={currentIndex}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse"
            />
            {greetings[currentIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DynamicText;
