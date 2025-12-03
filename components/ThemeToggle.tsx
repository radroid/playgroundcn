 "use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";

type ThemeValue = "light" | "dark" | "system";

type RippleState = {
  x: number;
  y: number;
  size: number;
  theme: ThemeValue;
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeValue>("system");
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (next: ThemeValue) => {
    // Notify any interested editors to snapshot their current state before
    // the global light/dark theme toggle is applied.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tweakcn:before-theme-toggle"));

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxDimension = Math.max(window.innerWidth, window.innerHeight);

        setRipple({
          x: centerX,
          y: centerY,
          size: maxDimension * 1.5,
          theme: next,
        });
      }
    }
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "dark") {
      applyTheme(true);
    } else if (theme === "light") {
      applyTheme(false);
    } else {
      // theme === "system" - use system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [theme]);

  return (
    <>
      <div ref={containerRef}>
        <ThemeSwitcher
          defaultValue="system"
          value={theme}
          onChange={handleChange}
          className="border border-zinc-100 bg-zinc-50/80 cursor-pointer dark:border-zinc-900 dark:bg-zinc-900/80"
        />
      </div>
      {ripple && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 h-full w-full"
          initial={{
            clipPath: `circle(0px at ${ripple.x}px ${ripple.y}px)`,
            opacity: 0.5,
          }}
          animate={{
            clipPath: `circle(${ripple.size}px at ${ripple.x}px ${ripple.y}px)`,
            opacity: 0,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          onAnimationComplete={() => setRipple(null)}
        >
          <div
            className={
              ripple.theme === "dark"
                ? "h-full w-full bg-black"
                : "h-full w-full bg-white"
            }
          />
        </motion.div>
      )}
    </>
  );
}

export default ThemeToggle;

