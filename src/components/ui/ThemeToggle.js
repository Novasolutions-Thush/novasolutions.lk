"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const btn =
  "grid h-10 place-items-center overflow-hidden border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent";

export default function ThemeToggle() {
  const { theme, isManual, mounted, toggleTheme, resetToAuto } = useTheme();

  // Same-size placeholder avoids layout shift before mount
  if (!mounted) return <div className="h-10 w-10" aria-hidden="true" />;

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      {/* Shown only when the theme was changed manually */}
      <AnimatePresence>
        {isManual && (
          <motion.button
            key="auto"
            type="button"
            onClick={resetToAuto}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 40 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.25 }}
            title="Back to automatic (time-based) theme"
            aria-label="Back to automatic theme"
            className={`${btn} text-accent`}
          >
            <Clock size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`${btn} w-10`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="grid place-items-center"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
