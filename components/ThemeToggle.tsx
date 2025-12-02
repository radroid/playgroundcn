"use client";

import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";

type ThemeValue = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeValue>("system");

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
      onChange={setTheme}
      className="border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/80"
    />
  );
}

export default ThemeToggle;

