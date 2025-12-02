import * as React from "react";
import ComponentEditor from "@/components/editor/ComponentEditor";
import type { ComponentEntry, ThemeEntry } from "@/lib/registry/types";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type ComponentExamplesClientProps = {
  entry: ComponentEntry;
  themes: ThemeEntry[];
  componentCode?: string;
  componentPath?: string;
  registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>;
};

export function ComponentExamplesClient({
  entry,
  themes,
  componentCode,
  componentPath,
  registryDependenciesCode,
}: ComponentExamplesClientProps) {
  // We don't need the theme selector here anymore as it's inside the ComponentEditor
  // But we might want to keep the dark/light mode toggle or let Sandpack handle it?
  // The ComponentEditor handles theme switching internally or via props.
  // For now, let's keep the mode toggle but remove the external theme selector
  // to avoid duplication, as ComponentEditor has its own.

  // However, ComponentEditor expects a theme string (e.g. "zinc", "red")
  // We can control it here or let it be uncontrolled.

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {entry.displayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {entry.description}
          </p>
        </div>
      </div>

      {entry.examples.map((example) => (
        <section key={example.id} className="space-y-3">
          <h2
            id={example.id}
            className="scroll-m-20 text-lg font-medium tracking-tight"
          >
            {example.name}
          </h2>
          <div className="h-[600px] border rounded-lg overflow-hidden">
            <ComponentEditor
              code={componentCode || ""}
              previewCode={example.code}
              componentName={entry.id}
              componentDisplayName={entry.displayName}
              componentDescription={entry.description}
              dependencies={entry.dependencies}
              registryDependenciesCode={registryDependenciesCode}
              saveStatus="idle"
            />
          </div>
        </section>
      ))}
    </div>
  );
}

export default ComponentExamplesClient;
