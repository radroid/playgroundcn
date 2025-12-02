import fs from "fs/promises";
import path from "path";
import type { ComponentExample } from "./types";

const PREVIEWS_BASE_PATH = path.join(process.cwd(), "components", "previews");

/**
 * Finds all preview files for a given component ID.
 * Supports patterns like:
 * - {componentId}-preview.tsx
 * - {componentId}-preview-2.tsx
 * - {componentId}-preview-3.tsx
 * etc.
 */
async function findPreviewFiles(
  componentId: string
): Promise<string[]> {
  try {
    const files = await fs.readdir(PREVIEWS_BASE_PATH);
    const previewPattern = new RegExp(
      `^${componentId}-preview(-\\d+)?\\.tsx$`
    );
    
    const matchingFiles = files
      .filter((file) => previewPattern.test(file))
      .sort((a, b) => {
        // Sort: -preview.tsx first, then -preview-2.tsx, -preview-3.tsx, etc.
        const aMatch = a.match(/^.*-preview(?:-(\d+))?\.tsx$/);
        const bMatch = b.match(/^.*-preview(?:-(\d+))?\.tsx$/);
        
        const aNum = aMatch?.[1] ? parseInt(aMatch[1], 10) : 0;
        const bNum = bMatch?.[1] ? parseInt(bMatch[1], 10) : 0;
        
        return aNum - bNum;
      });
    
    return matchingFiles;
  } catch (error) {
    console.error(`Error finding preview files for ${componentId}:`, error);
    return [];
  }
}

/**
 * Extracts the component name from a preview file.
 * Looks for: export default ComponentName or export function ComponentName()
 */
function extractComponentName(content: string): string | null {
  // Try to find the standalone default export (e.g., "export default AccordionDemo;")
  const defaultExportMatch = content.match(/export\s+default\s+(\w+);?\s*$/m);
  if (defaultExportMatch) {
    return defaultExportMatch[1];
  }
  
  // Try to find default export inline (e.g., "export default function ComponentName()")
  const inlineDefaultMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  if (inlineDefaultMatch) {
    return inlineDefaultMatch[1];
  }
  
  // Try to find any exported function name (fallback)
  const functionMatch = content.match(/export\s+function\s+(\w+)/);
  if (functionMatch) {
    return functionMatch[1];
  }
  
  return null;
}

/**
 * Transforms preview file code to Sandpack-compatible format.
 * Wraps the component in export default function App() { return <ComponentName />; }
 */
function transformPreviewCode(fileContent: string): string {
  // Check if the code already has export default function App
  if (fileContent.includes("export default function App()")) {
    return fileContent;
  }
  
  const componentName = extractComponentName(fileContent);
  
  if (!componentName) {
    // If we can't find the component name, return as-is (might already be in App format)
    return fileContent;
  }
  
  let code = fileContent;
  
  // Remove "use client" directive (Next.js specific, not needed in Sandpack)
  code = code.replace(/^["']use client["'];?\s*\n?/gm, "");
  
  // Remove standalone default export line at the end (e.g., "export default AccordionDemo;")
  // This handles both "export default ComponentName;" and "export default ComponentName"
  code = code.replace(/^export\s+default\s+\w+;?\s*$/m, "");
  
  // Trim trailing whitespace and newlines
  code = code.trim();
  
  // Ensure we don't have duplicate newlines before adding the App wrapper
  code = code.replace(/\n{3,}/g, "\n\n");
  
  // Wrap in App component
  return `${code}

export default function App() {
  return <${componentName} />;
}`;
}

/**
 * Generates an example ID and name from a preview filename.
 */
function generateExampleIdAndName(
  filename: string,
  componentId: string,
  index: number
): { id: string; name: string } {
  // Remove .tsx extension
  const baseName = filename.replace(/\.tsx$/, "");
  
  // Extract the suffix (e.g., "2" from "accordion-preview-2")
  const match = baseName.match(new RegExp(`^${componentId}-preview(?:-(\\d+))?$`));
  const suffix = match?.[1];
  
  if (suffix && parseInt(suffix, 10) > 1) {
    // For numbered previews, create names like "Preview 2", "Preview 3"
    return {
      id: `preview-${suffix}`,
      name: `Preview ${suffix}`,
    };
  }
  
  // For the first preview (or single preview), use "Default" or "Preview"
  if (index === 0) {
    return {
      id: "default",
      name: "Default",
    };
  }
  
  // Fallback
  return {
    id: `preview-${index + 1}`,
    name: `Preview ${index + 1}`,
  };
}

/**
 * Reads preview examples for a component from the previews directory.
 * Returns an array of ComponentExample objects.
 */
export async function getPreviewExamples(
  componentId: string
): Promise<ComponentExample[]> {
  const previewFiles = await findPreviewFiles(componentId);
  
  if (previewFiles.length === 0) {
    return [];
  }
  
  const examples: ComponentExample[] = [];
  
  for (let i = 0; i < previewFiles.length; i++) {
    const filename = previewFiles[i];
    const filePath = path.join(PREVIEWS_BASE_PATH, filename);
    
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const transformedCode = transformPreviewCode(fileContent);
      const { id, name } = generateExampleIdAndName(filename, componentId, i);
      
      examples.push({
        id,
        name,
        code: transformedCode,
      });
    } catch (error) {
      console.error(`Error reading preview file ${filename}:`, error);
      // Continue with other files
    }
  }
  
  return examples;
}


