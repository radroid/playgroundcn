import { notFound } from "next/navigation";
import { components } from "@/lib/registry/components";
import { themes } from "@/lib/registry/themes";
import { ComponentExamplesClient } from "./ComponentExamplesClient";
import {
  getComponentFileContent,
  getRegistryDependenciesCode,
} from "@/lib/registry/reader";

type ComponentPageParams = {
  id: string;
};

type ComponentPageProps = {
  // In newer Next versions, params is a Promise in RSCs.
  params: Promise<ComponentPageParams>;
};

// Ensure this route is treated as fully static and exportable.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): ComponentPageParams[] {
  return components.map((component) => ({
    id: component.id,
  }));
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;

  const entry = components.find((component) => component.id === id);

  if (!entry) {
    notFound();
  }

  // Read the main component file content
  let componentCode: string | undefined;
  let componentPath: string | undefined;

  if (entry.files?.length) {
    const mainFile = entry.files[0];
    // entry.files[0].path is "ui/button.tsx"
    // We want to load that content
    componentCode = await getComponentFileContent(mainFile.path);
    // transform "ui/button.tsx" -> "/components/ui/button.tsx" for the virtual file path in Sandpack
    componentPath = `/components/${mainFile.path}`;
  }

  // Read registry dependencies
  const rawRegistryDependenciesCode = entry.registryDependencies
    ? await getRegistryDependenciesCode(entry.registryDependencies)
    : {};

  // Enrich with dependencies from the registry
  const registryDependenciesCode: Record<string, { code: string; dependencies?: Record<string, string> }> = {};

  for (const [name, data] of Object.entries(rawRegistryDependenciesCode)) {
    const depEntry = components.find(c => c.id === name);
    registryDependenciesCode[name] = {
      code: data.code,
      dependencies: depEntry?.dependencies
    };
  }

  return (
    <ComponentExamplesClient
      entry={entry}
      themes={themes}
      componentCode={componentCode}
      componentPath={componentPath}
      registryDependenciesCode={registryDependenciesCode}
    />
  );
}
