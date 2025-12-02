export type SandpackTemplate = "react-ts";

export type ComponentExample = {
  id: string;
  name: string;
  code: string;
};

export type ComponentEntry = {
  /**
   * Shadcn component id, e.g. "button", "card".
   * This is used in the route `/component/[id]`.
   */
  id: string;
  /** Human‑readable name, e.g. "Button". */
  displayName: string;
  /** High‑level grouping, e.g. "ui" or "forms". */
  category: string;
  /** Short description shown in lists and headers. */
  description: string;

  /** Sandpack template – currently always "react-ts". */
  sandpackTemplate: SandpackTemplate;

  /**
   * NPM dependencies required to run the example code in Sandpack.
   * Example: { "lucide-react": "^0.555.0", "cmdk": "^0.2.0" }.
   */
  dependencies: Record<string, string>;

  /**
   * Optional list of Shadcn registry component ids this component depends on.
   * Mirrors the CSV `registryDependencies` column.
   */
  registryDependencies?: string[];

  /**
   * Files installed by the Shadcn registry for this component.
   * Mirrors the CSV `files` column.
   */
  files?: { path: string; type: string }[];

  /**
   * One or more TSX examples to render in Sandpack.
   */
  examples: ComponentExample[];
};

export type ThemeEntry = {
  id: string;
  name: string;
  css: string;
  cssVars?: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};
