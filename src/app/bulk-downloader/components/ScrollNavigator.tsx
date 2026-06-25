"use client";

import { useEffect, useState } from "react";

export function ScrollNavigator() {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      // Toggle buttons based on scroll position
      setShowScrollUp(scrolled > 200);
      setShowScrollDown(scrolled < maxScroll - 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-28 right-6 z-45 flex flex-col gap-2.5 animate-[fadeIn_0.3s_ease]">
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-neutral-900/80 dark:bg-black/80 backdrop-blur border border-neutral-800 hover:border-cyan-400 hover:text-cyan-400 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="w-10 h-10 rounded-full bg-neutral-900/80 dark:bg-black/80 backdrop-blur border border-neutral-800 hover:border-cyan-400 hover:text-cyan-400 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 group"
          aria-label="Scroll to bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ScrollNavigator;
