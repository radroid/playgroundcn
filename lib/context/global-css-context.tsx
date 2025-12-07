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

  // Ensure spacing is always defined (critical for Tailwind spacing utilities)
  const hasSpacing = vars.light && "spacing" in vars.light;
  const spacingVar = hasSpacing
    ? ""
    : "\n  --spacing: 0.25rem;";

  return `@custom-variant dark (&:is(.dark *));

:root {
${sharedVars ? sharedVars + "\n" : ""}${lightVars}${spacingVar}
}

.dark {
${darkVars}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --spacing: var(--spacing, 0.25rem);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

@layer base {
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
        updated.shared = { ...prev.shared, [key]: value };
      } else {
        updated[mode] = { ...prev[mode], [key]: value };
      }
      return updated;
    });

    // Regenerate CSS and update
    setCssVariables((prev) => {
      const newCss = generateCssFromVariables(prev);
      setGlobalCss(newCss);
      const detected = detectThemeFromCss(newCss);
      setCurrentTheme(detected);
      return prev;
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
