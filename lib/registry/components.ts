import type { ComponentEntry } from "./types";
import {
  BASE_DEPENDENCIES,
  COMPONENT_SPECIFIC_DEPS,
  COMPONENT_REGISTRY_DEPS,
} from "./component-dependencies";

/**
 * Static registry of Shadcn UI components used by the playground.
 *
 * This data is derived from the `shadcn-components - shadcn-components (2).csv`
 * file: we keep only the metadata and example code here, while the actual
 * implementations live in `components/ui/*` and are managed by the Shadcn CLI.
 *
 * PREVIEW FILES SYSTEM:
 * =====================
 * Instead of embedding example code inline in this file, you can create preview
 * files in `components/previews/`. The system will automatically load and use
 * preview files if they exist, taking precedence over examples defined here.
 *
 * Naming convention for preview files:
 * - Single preview: `{componentId}-preview.tsx`
 * - Multiple previews: `{componentId}-preview.tsx`, `{componentId}-preview-2.tsx`, etc.
 *
 * Example structure for accordion-preview.tsx:
 * ```tsx
 * export function AccordionDemo() {
 *   return <Accordion>...</Accordion>;
 * }
 * export default AccordionDemo;
 * ```
 *
 * The system will automatically:
 * - Find all preview files for a component
 * - Transform the code to Sandpack-compatible format
 * - Generate example IDs and names (first preview = "default", others = "Preview 2", etc.)
 *
 * Examples here will be used as fallback if no preview files exist.
 */

// Helper function to create component entry
function createEntry(
  id: string,
  displayName: string,
  category: string = "ui",
  description?: string
): ComponentEntry {
  const specificDeps = COMPONENT_SPECIFIC_DEPS[id] || {};
  const registryDeps = COMPONENT_REGISTRY_DEPS[id] || [];

  return {
    id,
    displayName,
    category,
    description: description || `Shadcn ui: ${displayName}`,
    sandpackTemplate: "react-ts",
    dependencies: {
      ...BASE_DEPENDENCIES,
      ...specificDeps,
    },
    registryDependencies: registryDeps.length > 0 ? registryDeps : undefined,
    files: [{ path: `ui/${id}.tsx`, type: "registry:ui" }],
    examples: [
      {
        id: "default",
        name: "Default",
        code: `// Preview files will be used if they exist
// This is a fallback example
export default function App() {
  return <div>${displayName} Component</div>;
}`,
      },
    ],
  };
}

export const components: ComponentEntry[] = [
  createEntry("accordion", "Accordion"),
  createEntry("alert", "Alert"),
  createEntry("alert-dialog", "Alert Dialog"),
  createEntry("aspect-ratio", "Aspect Ratio"),
  createEntry("avatar", "Avatar"),
  createEntry("badge", "Badge"),
  createEntry("breadcrumb", "Breadcrumb"),
  createEntry("button", "Button"),
  createEntry("button-group", "Button Group"),
  createEntry("calendar", "Calendar"),
  createEntry("card", "Card"),
  createEntry("carousel", "Carousel"),
  createEntry("chart", "Chart"),
  createEntry("checkbox", "Checkbox"),
  createEntry("collapsible", "Collapsible"),
  createEntry("combobox", "Combobox"),
  createEntry("command", "Command"),
  createEntry("context-menu", "Context Menu"),
  createEntry("dialog", "Dialog"),
  createEntry("drawer", "Drawer"),
  createEntry("dropdown-menu", "Dropdown Menu"),
  createEntry("empty", "Empty"),
  createEntry("field", "Field"),
  createEntry("form", "Form"),
  createEntry("hover-card", "Hover Card"),
  createEntry("input", "Input"),
  createEntry("input-group", "Input Group"),
  createEntry("input-otp", "Input OTP"),
  createEntry("item", "Item"),
  createEntry("kbd", "Kbd"),
  createEntry("label", "Label"),
  createEntry("menubar", "Menubar"),
  createEntry("navigation-menu", "Navigation Menu"),
  createEntry("pagination", "Pagination"),
  createEntry("popover", "Popover"),
  createEntry("progress", "Progress"),
  createEntry("radio-group", "Radio Group"),
  createEntry("resizable", "Resizable"),
  createEntry("scroll-area", "Scroll Area"),
  createEntry("select", "Select"),
  createEntry("separator", "Separator"),
  createEntry("sheet", "Sheet"),
  createEntry("sidebar", "Sidebar"),
  createEntry("skeleton", "Skeleton"),
  createEntry("slider", "Slider"),
  createEntry("sonner", "Sonner"),
  createEntry("spinner", "Spinner"),
  createEntry("switch", "Switch"),
  createEntry("table", "Table"),
  createEntry("tabs", "Tabs"),
  createEntry("textarea", "Textarea"),
  createEntry("toggle", "Toggle"),
  createEntry("toggle-group", "Toggle Group"),
  createEntry("tooltip", "Tooltip"),
];
