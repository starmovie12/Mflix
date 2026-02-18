"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => {
      setTimeout(() => setLoading(false), 300);
    };

    const observer = new MutationObserver(() => {
      handleStart();
      requestAnimationFrame(() => {
        requestAnimationFrame(handleComplete);
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    const timeout = setTimeout(handleComplete, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.8 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed left-0 top-0 z-[100] h-0.5 w-full origin-left bg-mflix-red"
        />
      )}
    </AnimatePresence>
  );
}
