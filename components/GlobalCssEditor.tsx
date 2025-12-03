"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { useGlobalCss } from "@/lib/context/global-css-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import registry from "./registry.json";

// =============================================================================
// Types
// =============================================================================

type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

// =============================================================================
// Variable Categories
// =============================================================================

const VARIABLE_CATEGORIES = {
  colors: {
    label: "Colors",
    variables: [
      "background",
      "foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
    ],
  },
  card: {
    label: "Card",
    variables: [
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ],
  },
  inputs: {
    label: "Inputs",
    variables: ["border", "input", "ring"],
  },
  sidebar: {
    label: "Sidebar",
    variables: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
  charts: {
    label: "Charts",
    variables: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  typography: {
    label: "Typography",
    variables: ["font-sans", "font-serif", "font-mono"],
  },
  spacing: {
    label: "Spacing",
    variables: ["radius", "spacing"],
  },
};

// Variables that should use text input instead of color picker
const TEXT_VARIABLES = new Set([
  "radius",
  "spacing",
  "font-sans",
  "font-serif",
  "font-mono",
  "tracking-normal",
  "tracking-tighter",
  "tracking-tight",
  "tracking-wide",
  "tracking-wider",
  "tracking-widest",
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
]);

// =============================================================================
// Color Conversion Utilities
// =============================================================================

function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_3 = l_ * l_ * l_;
  const m_3 = m_ * m_ * m_;
  const s_3 = s_ * s_ * s_;

  let r = +4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
  let g = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
  let b_ = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.7076147010 * s_3;

  const gamma = (val: number) => {
    if (val <= 0.0031308) {
      return 12.92 * val;
    }
    return 1.055 * Math.pow(val, 1.0 / 2.4) - 0.055;
  };

  r = gamma(r);
  g = gamma(g);
  b_ = gamma(b_);

  const r255 = Math.max(0, Math.min(255, Math.round(r * 255)));
  const g255 = Math.max(0, Math.min(255, Math.round(g * 255)));
  const b255 = Math.max(0, Math.min(255, Math.round(b_ * 255)));

  return [r255, g255, b255];
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // Convert RGB to linear RGB
  const toLinear = (c: number) => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Convert to OKLAB
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + bVal * bVal);
  let H = Math.atan2(bVal, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return [Math.round(L * 100) / 100, Math.round(C * 1000) / 1000, Math.round(H * 100) / 100];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
  }
  // Handle shorthand hex
  const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
  if (shortResult) {
    return [
      parseInt(shortResult[1] + shortResult[1], 16),
      parseInt(shortResult[2] + shortResult[2], 16),
      parseInt(shortResult[3] + shortResult[3], 16),
    ];
  }
  return [128, 128, 128];
}

// Parse any color format to RGB
function parseColorToRgb(value: string): [number, number, number] {
  if (!value) return [128, 128, 128];
  const trimmed = value.trim();

  // Handle oklch format
  if (trimmed.startsWith("oklch(")) {
    const match = trimmed.match(/oklch\(([^)]+)\)/);
    if (match) {
      const parts = match[1].trim().split(/\s+/).filter((p) => p);
      if (parts.length >= 1) {
        const l = parseFloat(parts[0]) || 0;
        const c = parts.length >= 2 ? parseFloat(parts[1]) || 0 : 0;
        const h = parts.length >= 3 ? parseFloat(parts[2]) || 0 : 0;
        try {
          return oklchToRgb(l, c, h);
        } catch {
          return [128, 128, 128];
        }
      }
    }
  }

  // Handle hex
  if (trimmed.startsWith("#")) {
    return hexToRgb(trimmed);
  }

  // Handle rgb
  if (trimmed.startsWith("rgb(")) {
    const match = trimmed.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }

  // Handle hsl
  if (trimmed.startsWith("hsl(")) {
    const match = trimmed.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%/);
    if (match) {
      return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }
  }

  return [128, 128, 128];
}

// Convert RGB to target format string
function rgbToFormat(r: number, g: number, b: number, format: ColorFormat): string {
  switch (format) {
    case "hex":
      return rgbToHex(r, g, b);
    case "rgb":
      return `rgb(${r}, ${g}, ${b})`;
    case "hsl": {
      const [h, s, l] = rgbToHsl(r, g, b);
      return `hsl(${h} ${s}% ${l}%)`;
    }
    case "oklch": {
      const [L, C, H] = rgbToOklch(r, g, b);
      return `oklch(${L} ${C} ${H})`;
    }
    default:
      return rgbToHex(r, g, b);
  }
}

// Convert any color value to target format
function convertColorToFormat(value: string, format: ColorFormat): string {
  const [r, g, b] = parseColorToRgb(value);
  return rgbToFormat(r, g, b, format);
}

// Extract hex from any color format (for color picker)
function extractHexFromValue(value: string): string {
  const [r, g, b] = parseColorToRgb(value);
  return rgbToHex(r, g, b);
}

// =============================================================================
// Theme Preview
// =============================================================================

function ThemePreview({ themeName }: { themeName: string }) {
  const theme = registry.items.find((item) => item.name === themeName);

  if (!theme || !theme.cssVars) {
    return (
      <div className="flex items-center gap-0.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full border border-border/50 bg-muted" />
        <div className="w-2.5 h-2.5 rounded-full border border-border/50 bg-muted" />
        <div className="w-2.5 h-2.5 rounded-full border border-border/50 bg-muted" />
        <div className="w-2.5 h-2.5 rounded-full border border-border/50 bg-muted" />
      </div>
    );
  }

  const lightVars = theme.cssVars.light || {};
  const primary = extractHexFromValue((lightVars.primary as string) || "#000000");
  const secondary = extractHexFromValue(
    (lightVars.secondary as string) || (lightVars.muted as string) || "#f5f5f5"
  );
  const accent = extractHexFromValue((lightVars.accent as string) || primary);
  const destructive = extractHexFromValue(
    (lightVars.destructive as string) || "#ef4444"
  );

  return (
    <div className="flex items-center gap-0.5 shrink-0" title={theme.label || themeName}>
      <div
        className="w-2.5 h-2.5 rounded-full border border-border/50 dark:border-border shadow-sm"
        style={{ backgroundColor: primary }}
      />
      <div
        className="w-2.5 h-2.5 rounded-full border border-border/50 dark:border-border shadow-sm"
        style={{ backgroundColor: secondary }}
      />
      <div
        className="w-2.5 h-2.5 rounded-full border border-border/50 dark:border-border shadow-sm"
        style={{ backgroundColor: accent }}
      />
      <div
        className="w-2.5 h-2.5 rounded-full border border-border/50 dark:border-border shadow-sm"
        style={{ backgroundColor: destructive }}
      />
    </div>
  );
}

// =============================================================================
// Variable Input Component
// =============================================================================

interface VariableInputProps {
  variableKey: string;
  value: string;
  colorFormat: ColorFormat;
  onChange: (value: string) => void;
}

function VariableInput({ variableKey, value, colorFormat, onChange }: VariableInputProps) {
  const isTextVariable = TEXT_VARIABLES.has(variableKey);
  const displayName = variableKey
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const hexValue = useMemo(() => {
    if (isTextVariable) return value;
    return extractHexFromValue(value);
  }, [value, isTextVariable]);

  const displayValue = useMemo(() => {
    if (isTextVariable) return value;
    return convertColorToFormat(value, colorFormat);
  }, [value, colorFormat, isTextVariable]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Color picker gives hex, convert to target format
      const newValue = rgbToFormat(...hexToRgb(e.target.value), colorFormat);
      onChange(newValue);
    },
    [onChange, colorFormat]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  if (isTextVariable) {
    return (
      <div className="flex items-center gap-2">
        <Label className="text-xs w-28 shrink-0 truncate" title={displayName}>
          {displayName}
        </Label>
        <Input
          type="text"
          value={value || ""}
          onChange={handleTextChange}
          className="h-7 text-xs flex-1"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs w-28 shrink-0 truncate" title={displayName}>
        {displayName}
      </Label>
      <div className="flex items-center gap-1 flex-1">
        <div className="relative">
          <input
            type="color"
            value={hexValue}
            onChange={handleColorChange}
            className="w-7 h-7 rounded border border-border cursor-pointer"
            style={{ padding: 0 }}
          />
        </div>
        <Input
          type="text"
          value={displayValue || ""}
          onChange={handleTextChange}
          className="h-7 text-xs flex-1 font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// =============================================================================
// Variable Category Section
// =============================================================================

interface VariableCategorySectionProps {
  category: keyof typeof VARIABLE_CATEGORIES;
  variables: Record<string, string>;
  colorFormat: ColorFormat;
  onVariableChange: (key: string, value: string) => void;
}

function VariableCategorySection({
  category,
  variables,
  colorFormat,
  onVariableChange,
}: VariableCategorySectionProps) {
  const categoryConfig = VARIABLE_CATEGORIES[category];
  const relevantVariables = categoryConfig.variables.filter(
    (key) => key in variables
  );

  if (relevantVariables.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {categoryConfig.label}
      </h4>
      <div className="space-y-1.5">
        {relevantVariables.map((key) => (
          <VariableInput
            key={key}
            variableKey={key}
            value={variables[key] || ""}
            colorFormat={colorFormat}
            onChange={(value) => onVariableChange(key, value)}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function GlobalCssEditor() {
  const { currentTheme, cssVariables, setTheme, updateVariable } = useGlobalCss();
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");

  const handleThemeSelect = useCallback(
    (value: string) => {
      if (value === currentTheme || value === "custom") return;
      setTheme(value);
    },
    [currentTheme, setTheme]
  );

  const handleVariableChange = useCallback(
    (key: string, value: string) => {
      updateVariable(activeMode, key, value);
    },
    [activeMode, updateVariable]
  );

  const options: ComboboxOption[] = useMemo(() => {
    const themeOptions: ComboboxOption[] = registry.items
      .filter((item) => item.type === "registry:style")
      .map((item) => ({
        value: item.name,
        label: item.label || item.name,
        preview: <ThemePreview themeName={item.name} />,
      }));

    if (currentTheme === "custom") {
      themeOptions.push({
        value: "custom",
        label: "Custom",
        preview: (
          <div className="flex items-center gap-0.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full border border-border/50 shadow-sm bg-purple-500" />
            <div className="w-2.5 h-2.5 rounded-full border border-border/50 shadow-sm bg-pink-500" />
            <div className="w-2.5 h-2.5 rounded-full border border-border/50 shadow-sm bg-orange-500" />
            <div className="w-2.5 h-2.5 rounded-full border border-border/50 shadow-sm bg-red-500" />
          </div>
        ),
      });
    }

    return themeOptions;
  }, [currentTheme]);

  return (
    <div className="flex flex-col h-full min-h-0 gap-3 py-2">
      {/* Fixed header controls - these won't scroll */}
      <div className="shrink-0 space-y-3">
        {/* Color Format Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Color Format</Label>
          <Select value={colorFormat} onValueChange={(v) => setColorFormat(v as ColorFormat)}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hex" className="text-xs">HEX (#ffffff)</SelectItem>
              <SelectItem value="rgb" className="text-xs">RGB (rgb(255, 255, 255))</SelectItem>
              <SelectItem value="hsl" className="text-xs">HSL (hsl(0 0% 100%))</SelectItem>
              <SelectItem value="oklch" className="text-xs">OKLCH (oklch(1 0 0))</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Theme</Label>
          <Combobox
            options={options}
            value={currentTheme}
            onValueChange={handleThemeSelect}
            placeholder="Select theme..."
            emptyText="No theme found."
            className="w-full"
          />
        </div>
      </div>

      {/* Mode Tabs - flex-1 to take remaining space */}
      <Tabs 
        value={activeMode} 
        onValueChange={(v) => setActiveMode(v as "light" | "dark")}
        className="flex flex-col flex-1 min-h-0"
      >
        <TabsList className="w-full h-8 shrink-0">
          <TabsTrigger value="light" className="flex-1 text-xs h-7">
            Light
          </TabsTrigger>
          <TabsTrigger value="dark" className="flex-1 text-xs h-7">
            Dark
          </TabsTrigger>
        </TabsList>

        <TabsContent value="light" className="flex-1 min-h-0 overflow-y-auto mt-3 pr-1">
          <div className="space-y-4">
            {Object.keys(VARIABLE_CATEGORIES).map((category) => (
              <VariableCategorySection
                key={category}
                category={category as keyof typeof VARIABLE_CATEGORIES}
                variables={cssVariables.light}
                colorFormat={colorFormat}
                onVariableChange={handleVariableChange}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dark" className="flex-1 min-h-0 overflow-y-auto mt-3 pr-1">
          <div className="space-y-4">
            {Object.keys(VARIABLE_CATEGORIES).map((category) => (
              <VariableCategorySection
                key={category}
                category={category as keyof typeof VARIABLE_CATEGORIES}
                variables={cssVariables.dark}
                colorFormat={colorFormat}
                onVariableChange={handleVariableChange}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
