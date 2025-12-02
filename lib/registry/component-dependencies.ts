/**
 * Component dependency mappings extracted from component files.
 * This helps build the component registry with correct dependencies.
 */

import type { ComponentEntry } from "./types";

export const BASE_DEPENDENCIES = {
  react: "19.2.0",
  "react-dom": "19.2.0",
  "next": "^16.0.6",
};

// Map of component IDs to their specific dependencies (excluding base deps)
export const COMPONENT_SPECIFIC_DEPS: Record<string, Record<string, string>> = {
  accordion: {
    "@radix-ui/react-accordion": "^1.2.12",
    "lucide-react": "^0.555.0",
  },
  "alert-dialog": {
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-slot": "^1.0.0",
  },
  alert: {
    "class-variance-authority": "^0.7.1",
  },
  "aspect-ratio": {
    "@radix-ui/react-aspect-ratio": "^1.1.8",
  },
  avatar: {
    "@radix-ui/react-avatar": "^1.1.11",
  },
  badge: {
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.1",
  },
  breadcrumb: {
    "lucide-react": "^0.555.0",
  },
  button: {
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.555.0",
  },
  "button-group": {
    "@radix-ui/react-slot": "^1.0.0",
  },
  calendar: {
    "react-day-picker": "^9.11.3",
    "lucide-react": "^0.555.0",
    "date-fns": "^4.1.0",
  },
  card: {
    "@radix-ui/react-slot": "^1.0.0",
  },
  carousel: {
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^0.555.0",
  },
  chart: {
    recharts: "2.15.4",
  },
  checkbox: {
    "@radix-ui/react-checkbox": "^1.3.3",
    "lucide-react": "^0.555.0",
  },
  collapsible: {
    "@radix-ui/react-collapsible": "^1.1.12",
  },
  combobox: {
    "cmdk": "^1.1.1",
    "lucide-react": "^0.555.0",
  },
  command: {
    "cmdk": "^1.1.1",
    "lucide-react": "^0.555.0",
  },
  "context-menu": {
    "@radix-ui/react-context-menu": "^2.2.16",
    "lucide-react": "^0.555.0",
  },
  dialog: {
    "@radix-ui/react-dialog": "^1.1.15",
    "lucide-react": "^0.555.0",
  },
  drawer: {
    "vaul": "^1.1.2",
  },
  "dropdown-menu": {
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "lucide-react": "^0.555.0",
  },
  empty: {
    "class-variance-authority": "^0.7.1",
  },
  field: {},
  form: {
    "react-hook-form": "^7.67.0",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.0.0",
    "@hookform/resolvers": "^5.2.2",
    "zod": "^4.1.13",
  },
  "hover-card": {
    "@radix-ui/react-hover-card": "^1.1.15",
  },
  input: {},
  "input-group": {},
  "input-otp": {
    "input-otp": "^1.4.2",
    "lucide-react": "^0.555.0",
  },
  item: {},
  kbd: {},
  label: {
    "@radix-ui/react-label": "^2.1.8",
  },
  menubar: {
    "@radix-ui/react-menubar": "^1.1.16",
    "lucide-react": "^0.555.0",
  },
  "navigation-menu": {
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.555.0",
    "motion": "^12.23.24",
  },
  pagination: {
    "lucide-react": "^0.555.0",
  },
  popover: {
    "@radix-ui/react-popover": "^1.1.15",
  },
  progress: {
    "@radix-ui/react-progress": "^1.1.8",
  },
  "radio-group": {
    "@radix-ui/react-radio-group": "^1.3.8",
  },
  resizable: {
    "react-resizable-panels": "^3.0.6",
    "lucide-react": "^0.555.0",
  },
  "scroll-area": {
    "@radix-ui/react-scroll-area": "^1.2.10",
  },
  select: {
    "@radix-ui/react-select": "^2.2.6",
    "lucide-react": "^0.555.0",
  },
  separator: {
    "@radix-ui/react-separator": "^1.1.8",
  },
  sheet: {
    "@radix-ui/react-dialog": "^1.1.15",
    "lucide-react": "^0.555.0",
  },
  skeleton: {},
  slider: {
    "@radix-ui/react-slider": "^1.3.6",
  },
  sonner: {
    "sonner": "^2.0.7",
  },
  spinner: {
    "lucide-react": "^0.555.0",
  },
  switch: {
    "@radix-ui/react-switch": "^1.2.6",
  },
  table: {},
  tabs: {
    "@radix-ui/react-tabs": "^1.1.13",
  },
  textarea: {},
  toggle: {
    "@radix-ui/react-toggle": "^1.1.10",
  },
  "toggle-group": {
    "@radix-ui/react-toggle-group": "^1.1.11",
  },
  tooltip: {
    "@radix-ui/react-tooltip": "^1.2.8",
  },
  sidebar: {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1",
    "motion": "^12.23.24",
    "lucide-react": "^0.555.0",
  },
};

// Map of component IDs to their registry dependencies (other shadcn components they use)
// NOTE: Includes dependencies from both component FILE imports and preview file usage.
// This ensures all components used in previews are available when rendering examples.
export const COMPONENT_REGISTRY_DEPS: Record<string, string[]> = {
  "alert-dialog": ["button", "alert"], // imports buttonVariants; preview uses: button
  alert: ["alert-dialog", "button"], // preview uses: button
  "button-group": ["separator", "button", "dropdown-menu"], // imports Separator; preview uses: button, dropdown-menu
  breadcrumb: ["dropdown-menu"], // preview uses: dropdown-menu
  calendar: ["button"], // imports Button, buttonVariants
  card: ["button", "input", "label"], // preview uses: button, input, label
  carousel: ["button", "card"], // imports Button; preview uses: card
  checkbox: ["label"], // preview uses: label
  collapsible: ["button"], // preview uses: button
  combobox: ["button", "command", "popover"], // imports all three
  command: ["dialog"], // imports Dialog
  dialog: ["button", "input", "label"], // preview uses: button, input, label
  drawer: ["button"], // preview uses: button
  "dropdown-menu": ["button"], // preview uses: button
  empty: ["button"], // preview uses: button
  field: ["label", "separator", "button", "checkbox", "input", "select", "textarea"], // imports Label, Separator; preview uses: button, checkbox, input, select, textarea
  form: ["label", "button", "input"], // imports Label; preview uses: button, input
  "hover-card": ["avatar", "button"], // preview uses: avatar, button
  "input-group": ["button", "input", "textarea", "dropdown-menu", "separator", "tooltip"], // imports Button, Input, Textarea; preview uses: dropdown-menu, separator, tooltip
  item: ["separator", "button"], // imports Separator; preview uses: button
  label: ["checkbox"], // preview uses: checkbox
  popover: ["button", "input", "label"], // preview uses: button, input, label
  "radio-group": ["label"], // preview uses: label
  "scroll-area": ["separator"], // preview uses: separator
  sheet: ["button", "input", "label"], // preview uses: button, input, label
  sidebar: ["button", "input", "separator", "sheet", "skeleton", "tooltip"], // imports all
  sonner: ["button"], // preview uses: button
  spinner: ["item"], // preview uses: item
  switch: ["label"], // preview uses: label
  tabs: ["button", "card", "input", "label"], // preview uses: button, card, input, label
  "toggle-group": ["toggle"], // imports toggleVariants
  tooltip: ["button"], // preview uses: button
};

/**
 * Helper to create component entry with merged dependencies
 */
export function createComponentEntry(
  id: string,
  displayName: string,
  category: string = "ui",
  description?: string
): Partial<ComponentEntry> {
  const specificDeps = COMPONENT_SPECIFIC_DEPS[id] || {};
  const registryDeps = COMPONENT_REGISTRY_DEPS[id] || [];

  return {
    id,
    displayName,
    category,
    description: description || `Shadcn ui: ${displayName}`,
    sandpackTemplate: "react-ts" as const,
    dependencies: {
      ...BASE_DEPENDENCIES,
      ...specificDeps,
    },
    registryDependencies: registryDeps.length > 0 ? registryDeps : undefined,
    files: [{ path: `ui/${id}.tsx`, type: "registry:ui" }],
    examples: [], // Preview files will provide examples
  };
}

