export type CachedFiles = Record<string, { code: string }>;

// In-memory cache of editor files keyed by component name.
// This never persists across full page reloads and satisfies the
// "no persistence" constraint while still letting us restore edits
// when navigating between components in a single session.
const componentCache: Record<string, CachedFiles> = {};

export function setComponentCache(componentName: string, files: CachedFiles) {
  componentCache[componentName] = files;
}

export function getComponentCache(
  componentName: string
): CachedFiles | undefined {
  return componentCache[componentName];
}


