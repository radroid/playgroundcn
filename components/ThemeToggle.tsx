"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";

type ThemeValue = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeValue>("system");

  const handleChange = (next: ThemeValue) => {
    // Notify any interested editors to snapshot their current state before
    // the global light/dark theme toggle is applied.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tweakcn:before-theme-toggle"));
    }
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeSwitcher
      defaultValue="system"
      value={theme}
      onChange={handleChange}
      className="border border-zinc-100 bg-zinc-50/80 cursor-pointer dark:border-zinc-900 dark:bg-zinc-900/80"
    />
  );
}

export default ThemeToggle;

