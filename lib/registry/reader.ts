import fs from "fs/promises";
import path from "path";

const COMPONENTS_BASE_PATH = path.join(process.cwd(), "components");

/**
 * Reads the content of a component file from the file system.
 * The path should be relative to the `components` directory.
 */
export async function getComponentFileContent(filePath: string): Promise<string> {
  try {
    const fullPath = path.join(COMPONENTS_BASE_PATH, filePath);
    const content = await fs.readFile(fullPath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error reading component file at ${filePath}:`, error);
    return `// Error: Could not read component file: ${filePath}`;
  }
}

/**
 * Reads the content of multiple registry dependencies.
 * Assumes dependencies are located in `components/ui/<name>.tsx`.
 */
export async function getRegistryDependenciesCode(
  dependencies: string[]
): Promise<Record<string, { code: string }>> {
  const result: Record<string, { code: string }> = {};

  for (const name of dependencies) {
    // We assume standard Shadcn structure: components/ui/<name>.tsx
    const filePath = `ui/${name}.tsx`;
    const code = await getComponentFileContent(filePath);
    if (code) {
      result[name] = { code };
    }
  }

  return result;
}

