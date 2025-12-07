import registry from "../registry.json";

// Non-color CSS variable keys that should not be wrapped in color functions
const NON_COLOR_KEYS = new Set([
    "radius",
    "font-sans",
    "font-serif",
    "font-mono",
    "spacing",
    "tracking-normal",
    "tracking-tighter",
    "tracking-tight",
    "tracking-wide",
    "tracking-wider",
    "tracking-widest",
    "letter-spacing",
    "shadow-color",
    "shadow-opacity",
    "shadow-blur",
    "shadow-spread",
    "shadow-offset-x",
    "shadow-offset-y",
    "shadow-x",
    "shadow-y",
    "shadow-2xs",
    "shadow-xs",
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
]);

/**
 * Animation utilities CSS matching tailwindcss-animate / tw-animate-css
 * These utilities are needed for components that use animation classes
 */
function getAnimationCss(): string {
    return `
/* Animation utilities for Sandpack */
@keyframes animate-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes animate-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoom-in-90 {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoom-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-top-2 {
  from {
    transform: translateY(-0.5rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-bottom-2 {
  from {
    transform: translateY(0.5rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-left-2 {
  from {
    transform: translateX(-0.5rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-left-52 {
  from {
    transform: translateX(-13rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-right-2 {
  from {
    transform: translateX(0.5rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-right-52 {
  from {
    transform: translateX(13rem);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-to-top {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@keyframes slide-out-to-bottom {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes slide-out-to-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slide-out-to-right {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

/* Animation utility classes - initial states */
.animate-in {
  animation: animate-in 0.15s ease-out;
}

.animate-out {
  animation: animate-out 0.15s ease-in;
}

.fade-in {
  animation: fade-in 0.15s ease-out;
}

.fade-out {
  animation: fade-out 0.15s ease-in;
}

.zoom-in-95 {
  animation: zoom-in 0.15s ease-out forwards;
}

.zoom-in-90 {
  animation: zoom-in-90 0.15s ease-out forwards;
}

.zoom-out-95 {
  animation: zoom-out 0.15s ease-in;
}

.fade-in-0 {
  opacity: 0;
  animation: fade-in 0.15s ease-out;
}

.fade-out-0 {
  opacity: 1;
  animation: fade-out 0.15s ease-in;
}

/* Slide animations with distance variants - initial states */
.slide-in-from-top-2 {
  animation: slide-in-from-top-2 0.2s ease-out forwards;
}

.slide-in-from-bottom-2 {
  animation: slide-in-from-bottom-2 0.2s ease-out forwards;
}

.slide-in-from-left-2 {
  animation: slide-in-from-left-2 0.2s ease-out forwards;
}

.slide-in-from-right-2 {
  animation: slide-in-from-right-2 0.2s ease-out forwards;
}

.slide-in-from-left-52 {
  animation: slide-in-from-left-52 0.3s ease-out forwards;
}

.slide-in-from-right-52 {
  animation: slide-in-from-right-52 0.3s ease-out forwards;
}

.slide-out-to-right-52 {
  animation: slide-out-to-right 0.3s ease-in;
}

.slide-out-to-left-52 {
  animation: slide-out-to-left 0.3s ease-in;
}

.slide-out-to-top {
  animation: slide-out-to-top 0.2s ease-in;
}

.slide-out-to-bottom {
  animation: slide-out-to-bottom 0.2s ease-in;
}

.slide-out-to-left {
  animation: slide-out-to-left 0.2s ease-in;
}

.slide-out-to-right {
  animation: slide-out-to-right 0.2s ease-in;
}

/* Data attribute selectors for conditional animations */
[data-state=open].animate-in,
[data-state=open] .animate-in {
  animation: animate-in 0.15s ease-out;
}

[data-state=closed].animate-out,
[data-state=closed] .animate-out {
  animation: animate-out 0.15s ease-in;
}

[data-state=open].fade-in-0,
[data-state=open] .fade-in-0 {
  animation: fade-in 0.15s ease-out;
  opacity: 1;
}

[data-state=closed].fade-out-0,
[data-state=closed] .fade-out-0 {
  animation: fade-out 0.15s ease-in;
  opacity: 0;
}

[data-state=open].zoom-in-95,
[data-state=open] .zoom-in-95 {
  animation: zoom-in 0.15s ease-out;
  transform: scale(1);
  opacity: 1;
}

[data-state=closed].zoom-out-95,
[data-state=closed] .zoom-out-95 {
  animation: zoom-out 0.15s ease-in;
  transform: scale(0.95);
  opacity: 0;
}

[data-state=open].zoom-in-90,
[data-state=open] .zoom-in-90 {
  animation: zoom-in 0.15s ease-out;
  transform: scale(1);
  opacity: 1;
}

[data-state=closed].zoom-in-90,
[data-state=closed] .zoom-in-90 {
  transform: scale(0.9);
  opacity: 0;
}

[data-state=visible].animate-in,
[data-state=visible] .animate-in {
  animation: animate-in 0.15s ease-out;
}

[data-state=hidden].animate-out,
[data-state=hidden] .animate-out {
  animation: animate-out 0.15s ease-in;
}

[data-state=visible].fade-in,
[data-state=visible] .fade-in {
  animation: fade-in 0.15s ease-out;
  opacity: 1;
}

[data-state=hidden].fade-out,
[data-state=hidden] .fade-out {
  animation: fade-out 0.15s ease-in;
  opacity: 0;
}

/* Motion-based animations for navigation menu */
[data-motion^=from-].animate-in {
  animation: animate-in 0.2s ease-out;
}

[data-motion^=to-].animate-out {
  animation: animate-out 0.2s ease-in;
}

[data-motion^=from-].fade-in {
  animation: fade-in 0.2s ease-out;
  opacity: 1;
}

[data-motion^=to-].fade-out {
  animation: fade-out 0.2s ease-in;
  opacity: 0;
}

[data-motion=from-end].slide-in-from-right-52 {
  animation: slide-in-from-right 0.3s ease-out forwards;
}

[data-motion=from-start].slide-in-from-left-52 {
  animation: slide-in-from-left 0.3s ease-out forwards;
}

[data-motion=to-end].slide-out-to-right-52 {
  animation: slide-out-to-right 0.3s ease-in forwards;
}

[data-motion=to-start].slide-out-to-left-52 {
  animation: slide-out-to-left 0.3s ease-in forwards;
}
`;
}

export function getThemeCss(themeName: string = "default"): string {
    const theme = registry.items.find((item) => item.name === themeName);
    if (!theme) {
        console.warn(`Theme '${themeName}' not found in registry. Using default.`);
        return getThemeCss("default");
    }

    const { light, dark, theme: shared } = theme.cssVars;

    // Format CSS values properly
    const formatValue = (key: string, value: string): string => {
        // If it's a non-color value, return as-is
        if (NON_COLOR_KEYS.has(key)) {
            return value;
        }
        // If it's already wrapped in a function (oklch, hsl, rgb, etc.), return as-is
        if (value.includes("(")) {
            return value;
        }
        // If it starts with # (hex color), return as-is
        if (value.startsWith("#")) {
            return value;
        }
        // Format bare HSL values: "0 0% 100%" -> "hsl(0 0% 100%)"
        if (/^\d+(\s+\d+%){2}$/.test(value.trim())) {
            return `hsl(${value})`;
        }
        return value;
    };

    const lightVars = Object.entries(light || {})
        .map(([key, value]) => `  --${key}: ${formatValue(key, value as string)};`)
        .join("\n");

    const darkVars = Object.entries(dark || {})
        .map(([key, value]) => `  --${key}: ${formatValue(key, value as string)};`)
        .join("\n");

    const sharedVars = shared
        ? Object.entries(shared)
            .map(([key, value]) => `  --${key}: ${value};`)
            .join("\n")
        : "";

    // Destructive foreground (if not in registry, add default)
    const hasDestructiveForeground = light && "destructive-foreground" in light;
    const destructiveForegroundVar = hasDestructiveForeground
        ? ""
        : "\n  --destructive-foreground: hsl(0 0% 98%);";

    const hasDestructiveForegroundDark = dark && "destructive-foreground" in dark;
    const destructiveDarkVar = hasDestructiveForegroundDark
        ? ""
        : "\n  --destructive-foreground: hsl(0 0% 98%);";

    // Ensure spacing is always defined (critical for Tailwind spacing utilities)
    const hasSpacing = light && "spacing" in light;
    const spacingVar = hasSpacing
        ? ""
        : "\n  --spacing: 0.25rem;";

    const themeCss = `@custom-variant dark (&:is(.dark *));

:root {
${sharedVars ? sharedVars + "\n" : ""}${lightVars}${destructiveForegroundVar}${spacingVar}
}

.dark {
${darkVars}${destructiveDarkVar}
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

    // Append animation utilities CSS
    return themeCss + getAnimationCss();
}

export const DEFAULT_GLOBAL_CSS = getThemeCss("default");

/**
 * Detects which preset theme matches the given CSS string.
 * Returns the theme name if a match is found, or "custom" if no match.
 */
export function detectThemeFromCss(css: string): string {
    if (!css || css.trim().length === 0) {
        return "default";
    }

    // Normalize the CSS by removing whitespace and comments
    const normalizeCss = (str: string): string => {
        return str
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim();
    };

    const normalizedInput = normalizeCss(css);

    // Check each theme in the registry
    for (const theme of registry.items) {
        if (theme.type !== "registry:style") continue;

        const themeCss = getThemeCss(theme.name);
        const normalizedTheme = normalizeCss(themeCss);

        // Compare the normalized CSS strings
        // We'll do a more lenient comparison - check if key CSS variables match
        if (normalizedInput === normalizedTheme) {
            return theme.name;
        }

        // More lenient matching: extract key CSS variables and compare
        const extractKeyVars = (cssStr: string): Map<string, string> => {
            const vars = new Map<string, string>();
            const varRegex = /--([^:]+):\s*([^;]+);/g;
            let match;
            while ((match = varRegex.exec(cssStr)) !== null) {
                const key = match[1].trim();
                const value = match[2].trim();
                // Only track important color variables
                if (
                    key.includes("background") ||
                    key.includes("foreground") ||
                    key.includes("primary") ||
                    key.includes("secondary") ||
                    key.includes("muted") ||
                    key.includes("accent") ||
                    key.includes("destructive") ||
                    key.includes("border") ||
                    key.includes("ring")
                ) {
                    vars.set(key, normalizeCss(value));
                }
            }
            return vars;
        };

        const inputVars = extractKeyVars(normalizedInput);
        const themeVars = extractKeyVars(normalizedTheme);

        // Check if all key variables match
        if (inputVars.size > 0 && inputVars.size === themeVars.size) {
            let matches = 0;
            for (const [key, value] of inputVars.entries()) {
                if (themeVars.get(key) === value) {
                    matches++;
                }
            }
            // If 90% or more of the key variables match, consider it a match
            if (matches / inputVars.size >= 0.9) {
                return theme.name;
            }
        }
    }

    return "custom";
}
