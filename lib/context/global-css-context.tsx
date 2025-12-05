"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getThemeCss, detectThemeFromCss } from "@/components/editor/theme-generator";
import registry from "@/components/registry.json";

// CSS Variable types
export interface CssVariables {
  light: Record<string, string>;
  dark: Record<string, string>;
  shared?: Record<string, string>;
}

interface GlobalCssContextValue {
  /** Current theme name (or "custom" if manually edited) */
  currentTheme: string;
  /** Current CSS string */
  globalCss: string;
  /** Current CSS variables as objects */
  cssVariables: CssVariables;
  /** Set the theme (generates CSS from theme) */
  setTheme: (themeName: string) => void;
  /** Set custom CSS (marks theme as "custom") */
  setCustomCss: (css: string) => void;
  /** Update a single CSS variable */
  updateVariable: (mode: "light" | "dark" | "shared", key: string, value: string) => void;
}

const GlobalCssContext = createContext<GlobalCssContextValue | null>(null);

// Parse CSS string back to variables
function parseCssToVariables(css: string): CssVariables {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  // Extract :root variables (light mode)
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
  if (rootMatch) {
    const varRegex = /--([^:]+):\s*([^;]+);/g;
    let match;
    while ((match = varRegex.exec(rootMatch[1])) !== null) {
      light[match[1].trim()] = match[2].trim();
    }
  }

  // Extract .dark variables
  const darkMatch = css.match(/\.dark\s*\{([^}]+)\}/);
  if (darkMatch) {
    const varRegex = /--([^:]+):\s*([^;]+);/g;
    let match;
    while ((match = varRegex.exec(darkMatch[1])) !== null) {
      dark[match[1].trim()] = match[2].trim();
    }
  }

  return { light, dark };
}

// Generate CSS string from variables
function generateCssFromVariables(vars: CssVariables): string {
  const lightVars = Object.entries(vars.light)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const darkVars = Object.entries(vars.dark)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const sharedVars = vars.shared
    ? Object.entries(vars.shared)
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n")
    : "";

  return `:root {
${sharedVars ? sharedVars + "\n" : ""}${lightVars}
}

.dark {
${darkVars}
}

*,
*::before,
*::after {
  border-color: var(--border);
  outline-color: var(--ring);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans, "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
  letter-spacing: var(--tracking-normal, 0em);
}
`;
}

// Helper to filter out undefined values and ensure Record<string, string>
function cleanCssVars(vars: any): Record<string, string> {
  const cleaned: Record<string, string> = {};
  if (vars && typeof vars === 'object') {
    for (const [key, value] of Object.entries(vars)) {
      if (typeof value === 'string') {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// Get initial variables from a theme
function getThemeVariables(themeName: string): CssVariables {
  const theme = registry.items.find((item) => item.name === themeName);
  if (!theme || !theme.cssVars) {
    return { light: {}, dark: {} };
  }

  return {
    light: cleanCssVars(theme.cssVars.light),
    dark: cleanCssVars(theme.cssVars.dark),
    shared: theme.cssVars.theme ? cleanCssVars(theme.cssVars.theme) : undefined,
  };
}

export function GlobalCssProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [globalCss, setGlobalCss] = useState(() => getThemeCss("default"));
  const [cssVariables, setCssVariables] = useState<CssVariables>(() => 
    getThemeVariables("default")
  );

  const setTheme = useCallback((themeName: string) => {
    setCurrentTheme(themeName);
    setGlobalCss(getThemeCss(themeName));
    setCssVariables(getThemeVariables(themeName));
  }, []);

  const setCustomCss = useCallback((css: string) => {
    const detected = detectThemeFromCss(css);
    setCurrentTheme(detected);
    setGlobalCss(css);
    setCssVariables(parseCssToVariables(css));
  }, []);

  const updateVariable = useCallback((mode: "light" | "dark" | "shared", key: string, value: string) => {
    setCssVariables((prev) => {
      const updated = { ...prev };
      if (mode === "shared") {
        updated.shared = { ...(prev.shared || {}), [key]: value };
      } else {
        updated[mode] = { ...prev[mode], [key]: value };
      }
      
      // Regenerate CSS and update theme detection
      const newCss = generateCssFromVariables(updated);
      setGlobalCss(newCss);
      const detected = detectThemeFromCss(newCss);
      setCurrentTheme(detected);
      
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      currentTheme,
      globalCss,
      cssVariables,
      setTheme,
      setCustomCss,
      updateVariable,
    }),
    [currentTheme, globalCss, cssVariables, setTheme, setCustomCss, updateVariable]
  );

  return (
    <GlobalCssContext.Provider value={value}>
      {children}
    </GlobalCssContext.Provider>
  );
}

export function useGlobalCss() {
  const context = useContext(GlobalCssContext);
  if (!context) {
    throw new Error("useGlobalCss must be used within a GlobalCssProvider");
  }
  return context;
}
