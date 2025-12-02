import registry from "@/components/registry.json";
import type { ThemeEntry } from "./types";

const BASE_STYLES = `
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    sans-serif;
  font-feature-settings: "rlig" 1, "calt" 1;
}

.app-root {
  padding: 1.5rem;
}

/* Button (data-slot="button") */
[data-slot="button"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding-inline: 0.9rem;
  padding-block: 0.5rem;
  border-radius: var(--radius, 0.5rem);
  border: 1px solid transparent;
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  cursor: pointer;
  transition:
    background-color 120ms ease-out,
    color 120ms ease-out,
    border-color 120ms ease-out,
    box-shadow 120ms ease-out,
    transform 80ms ease-out;
}

[data-slot="button"]:hover {
  background-color: color-mix(in srgb, var(--primary) 90%, black 10%);
}

[data-slot="button"]:focus-visible {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 1px #020617, 0 0 0 3px var(--ring);
}

[data-slot="button"]:active {
  transform: translateY(0.5px);
}

/* Input (data-slot="input") */
[data-slot="input"] {
  height: 2.25rem;
  border-radius: var(--radius, 0.5rem);
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  padding-inline: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition:
    border-color 120ms ease-out,
    box-shadow 120ms ease-out,
    background-color 120ms ease-out;
}

[data-slot="input"]::placeholder {
  color: var(--muted-foreground);
}

[data-slot="input"]:focus-visible {
  border-color: var(--ring);
  box-shadow: 0 0 0 1px #020617, 0 0 0 3px var(--ring);
}

/* Label (data-slot="label") */
[data-slot="label"] {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted-foreground);
}

/* Card (data-slot="card" + children) */
[data-slot="card"] {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: var(--radius, 0.75rem);
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--card-foreground);
  padding-block: 1.5rem;
  box-shadow: var(--shadow, 0 1px 3px rgba(0,0,0,0.1));
}

[data-slot="card-header"],
[data-slot="card-content"],
[data-slot="card-footer"] {
  padding-inline: 1.5rem;
}

[data-slot="card-title"] {
  font-size: 1rem;
  font-weight: 600;
}

[data-slot="card-description"] {
  font-size: 0.875rem;
  color: var(--muted-foreground);
}

[data-slot="card-footer"] {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Calendar (data-slot="calendar") */
[data-slot="calendar"] {
  --cell-size: 2.25rem;
  border-radius: var(--radius, 0.75rem);
  border: 1px solid var(--border);
  background-color: var(--card);
  color: var(--card-foreground);
  padding: 0.75rem;
  box-shadow: var(--shadow, 0 1px 3px rgba(0,0,0,0.08));
}

[data-slot="calendar"] .rdp {
  width: -moz-fit-content;
  width: fit-content;
}

[data-slot="calendar"] .rdp-months {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

@media (min-width: 768px) {
  [data-slot="calendar"] .rdp-months {
    flex-direction: row;
  }
}

[data-slot="calendar"] .rdp-month {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

[data-slot="calendar"] .rdp-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  position: absolute;
  inset-inline: 0;
  top: 0;
  padding-inline: 0.25rem;
}

[data-slot="calendar"] .rdp-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--cell-size);
  width: 100%;
}

[data-slot="calendar"] .rdp-caption_dropdowns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  height: var(--cell-size);
}

[data-slot="calendar"] .rdp-head {
  display: flex;
  width: 100%;
}

[data-slot="calendar"] .rdp-head_row {
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
}

[data-slot="calendar"] .rdp-head_cell {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--muted-foreground);
}

[data-slot="calendar"] .rdp-row {
  display: flex;
  width: 100%;
  margin-top: 0.25rem;
}

[data-slot="calendar"] .rdp-cell {
  position: relative;
  flex: 1;
  padding: 0;
}

[data-slot="calendar"] .rdp-day {
  width: 100%;
  height: 100%;
  min-width: var(--cell-size);
}

[data-slot="calendar"] .rdp-day_today button {
  background-color: color-mix(in srgb, var(--accent) 80%, transparent);
  color: var(--accent-foreground);
  border-radius: 0.375rem;
}

[data-slot="calendar"] .rdp-day_selected button {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-radius: 0.375rem;
}

[data-slot="calendar"] .rdp-day_outside {
  color: var(--muted-foreground);
}

[data-slot="calendar"] .rdp-day_disabled {
  color: var(--muted-foreground);
  opacity: 0.5;
}
`;

export const themes: ThemeEntry[] = registry.items.map((item: any) => ({
  id: item.name,
  name: item.label,
  css: "", // CSS is generated on demand via getThemeCss
  cssVars: item.cssVars,
}));

export function getThemeCss(
  themeId: string,
  mode: "light" | "dark" = "light"
): string {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme || !theme.cssVars) {
    return BASE_STYLES;
  }

  const vars = theme.cssVars[mode];
  if (!vars) {
    return BASE_STYLES;
  }

  const cssVarsString = Object.entries(vars)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n  ");

  return `:root {
  ${cssVarsString}
}

${BASE_STYLES}`;
}
