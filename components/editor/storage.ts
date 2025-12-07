"use client";

export type CachedFiles = Record<string, { code: string }>;

// localStorage key prefix for Sandpack file caches
const STORAGE_PREFIX = "sandpack-playground-";

/**
 * Get the storage key for a component instance (component + example)
 */
function getStorageKey(componentName: string, exampleId: string = "default"): string {
  return `${STORAGE_PREFIX}${componentName}-${exampleId}`;
}

/**
 * Save Sandpack files to localStorage for a specific component instance
 * This persists user edits across page reloads and navigation
 * Only writes if the data actually changed to avoid unnecessary localStorage operations
 */
export function setComponentCache(
  componentName: string,
  files: CachedFiles,
  exampleId: string = "default"
): void {
  if (typeof window === "undefined") return;
  
  try {
    const key = getStorageKey(componentName, exampleId);
    const serialized = JSON.stringify(files);
    
    // Check if data actually changed before writing
    const existing = window.localStorage.getItem(key);
    if (existing === serialized) {
      // No changes, skip write
      return;
    }
    
    window.localStorage.setItem(key, serialized);
    // Update in-memory cache
    cacheReadCache.set(key, { data: files, timestamp: Date.now() });
    // Only log in development to reduce console noise
    if (process.env.NODE_ENV === 'development') {
      console.log('[Storage] Saved to localStorage:', { key, filesCount: Object.keys(files).length });
    }
  } catch (error) {
    console.error('[Storage] Failed to save to localStorage:', error);
    // localStorage might be full or disabled, fail silently
  }
}

/**
 * Get cached Sandpack files from localStorage for a specific component instance
 * Returns undefined if no cache exists or if localStorage is unavailable
 */
// Cache for localStorage reads to avoid redundant reads
const cacheReadCache = new Map<string, { data: CachedFiles; timestamp: number }>();
const CACHE_TTL = 100; // 100ms cache to prevent redundant reads in same render cycle

export function getComponentCache(
  componentName: string,
  exampleId: string = "default"
): CachedFiles | undefined {
  if (typeof window === "undefined") return undefined;
  
  const key = getStorageKey(componentName, exampleId);
  const now = Date.now();
  
  // Check in-memory cache first
  const cached = cacheReadCache.get(key);
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    const saved = window.localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved) as CachedFiles;
      // Cache the result
      cacheReadCache.set(key, { data: parsed, timestamp: now });
      // Only log in development to reduce console noise
      if (process.env.NODE_ENV === 'development') {
        console.log('[Storage] Loaded from localStorage:', { key, filesCount: Object.keys(parsed).length });
      }
      return parsed;
    }
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storage] Failed to load from localStorage:', error);
    }
    // If corrupted, remove the bad entry
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
  
  return undefined;
}

/**
 * Clear cached files for a specific component instance
 */
export function clearComponentCache(
  componentName: string,
  exampleId: string = "default"
): void {
  if (typeof window === "undefined") return;
  
  try {
    const key = getStorageKey(componentName, exampleId);
    window.localStorage.removeItem(key);
    // Clear from in-memory cache
    cacheReadCache.delete(key);
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Storage] Cleared from localStorage:', { key });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storage] Failed to clear from localStorage:', error);
    }
  }
}

/**
 * Clear all Sandpack caches (useful for reset functionality)
 */
export function clearAllComponentCaches(): void {
  if (typeof window === "undefined") return;
  
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      window.localStorage.removeItem(key);
      cacheReadCache.delete(key);
    });
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Storage] Cleared all caches:', { count: keys.length });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Storage] Failed to clear all caches:', error);
    }
  }
}


