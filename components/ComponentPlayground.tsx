"use client";

import * as React from "react";
import type {
  RegistryDependencyCode,
  SandpackFilesMap,
} from "@/lib/sandpack/files";
import { prepareSandpackFiles } from "@/lib/sandpack/files";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";

type ComponentPlaygroundProps = {
  exampleCode: string;
  template?: "react-ts";
  dependencies: Record<string, string>;
  globalsCss: string;
  title: string;
  /**
   * Optional main registry component path and code, e.g. `/components/ui/card.tsx`.
   * This can be wired from the `files` entry in the component registry.
   */
  componentPath?: string;
  componentCode?: string;
  /**
   * Optional additional registry dependencies (e.g. `button`, `input`, `label`)
   * that should be available under `/components/ui/<name>.tsx` inside Sandpack.
   */
  registryDependenciesCode?: Record<string, RegistryDependencyCode>;
};

export function ComponentPlayground({
  exampleCode,
  template = "react-ts",
  dependencies,
  globalsCss,
  title,
  componentPath,
  componentCode,
  registryDependenciesCode,
}: ComponentPlaygroundProps) {
  const { resolvedTheme } = useTheme();
  const effectiveComponentPath =
    componentPath ?? "/components/ui/component.tsx";
  const effectiveComponentCode = componentCode ?? "export {};\n";

  const files: SandpackFilesMap = React.useMemo(
    () =>
      prepareSandpackFiles({
        previewCode: exampleCode,
        globalsCss,
        componentPath: effectiveComponentPath,
        componentCode: effectiveComponentCode,
        registryDependenciesCode,
      }),
    [
      exampleCode,
      globalsCss,
      effectiveComponentPath,
      effectiveComponentCode,
      registryDependenciesCode,
    ]
  );

  return (
    <section className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
      <header className="border-b px-4 py-2 text-sm font-medium">
        {title}
      </header>
      <div className="p-2">
        <SandpackProvider
          template={template}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          files={files}
          customSetup={{
            dependencies: {
              ...dependencies,
              "clsx": "^2.0.0",
              "tailwind-merge": "^2.0.0",
            },
          }}
        >
          <SandpackLayout className="h-[350px] max-h-[60vh]">
            <SandpackCodeEditor showTabs={false} showLineNumbers />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </section>
  );
}

export default ComponentPlayground;
