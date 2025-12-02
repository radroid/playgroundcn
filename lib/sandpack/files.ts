export type RegistryDependencyCode = {
  code: string;
  hidden?: boolean;
};

export type PrepareSandpackFilesArgs = {
  /**
   * The main preview/example code that will be loaded into `/Preview.tsx`.
   * This is the code users edit in the playground.
   */
  previewCode: string;
  /**
   * Precompiled global CSS for the sandbox, injected as `/styles/globals.css`.
   * This should be the Tailwind‑compiled CSS (or a subset) for the active theme.
   */
  globalsCss: string;
  /**
   * Main registry component path and implementation, e.g. `/components/ui/button.tsx`.
   * This must match the import paths used in the example code, like
   * `import { Button } from "@/components/ui/button"`.
   */
  componentPath: string;
  componentCode: string;
  /**
   * Optional additional registry dependencies that should be available under
   * `/components/ui/<name>.tsx`.
   *
   * This is typically derived from the `registryDependencies` field in the
   * component registry.
   */
  registryDependenciesCode?: Record<string, RegistryDependencyCode>;
};

type SandpackFileDefinition = {
  code: string;
  active?: boolean;
  hidden?: boolean;
};

export type SandpackFilesMap = Record<string, SandpackFileDefinition>;

const UTILS_CODE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const TSCONFIG_CODE = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
`;

const INDEX_CODE = `import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";
import Preview from "./Preview";

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <div className="app-root">
      <Preview />
    </div>
  </React.StrictMode>
);
`;

/**
 * Build the complete Sandpack files map for a component example.
 *
 * This matches the file structure expected by examples that import
 * Shadcn components from `@/components/ui/*` and utilities from
 * `@/lib/utils`.
 */
export function prepareSandpackFiles({
  previewCode,
  globalsCss,
  componentPath,
  componentCode,
  registryDependenciesCode,
}: PrepareSandpackFilesArgs): SandpackFilesMap {
  const registryFiles: SandpackFilesMap = registryDependenciesCode
    ? Object.entries(registryDependenciesCode).reduce<SandpackFilesMap>(
        (acc, [name, data]) => {
          acc[`/components/ui/${name}.tsx`] = {
            code: data.code,
            hidden: data.hidden ?? false,
          };
          return acc;
        },
        {}
      )
    : {};

  const files: SandpackFilesMap = {
    "/Preview.tsx": {
      code: previewCode,
    },
    "/index.tsx": {
      code: INDEX_CODE,
      active: false,
    },
    "/styles/globals.css": {
      code: globalsCss,
      hidden: true,
    },
    "/lib/utils.ts": {
      code: UTILS_CODE,
      hidden: true,
    },
    "/tsconfig.json": {
      code: TSCONFIG_CODE,
      hidden: true,
    },
    ...registryFiles,
  };

  files[componentPath] = {
    code: componentCode,
    hidden: false,
  };

  return files;
}



