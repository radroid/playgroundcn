"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
    SandpackProvider,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
    SandpackLayout,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SaveStatus } from "./SaveStatusIndicator";
import { EditorToolbar } from "./EditorToolbar";
import {
    getIndexHtml,
    getMainTsx,
    getAppTsx,
    getIndexCss,
    getViteConfig,
    UTILS_CODE,
    TSCONFIG_CODE,
    USE_MOBILE_CODE,
} from "@/lib/sandpack/vite-react-template";
import { getComponentCache, setComponentCache, clearComponentCache } from "./storage";
import { useGlobalCss } from "@/lib/context/global-css-context";
import { toast } from "sonner";

// =============================================================================
// Types
// =============================================================================

export interface ComponentEditorProps {
    /** The component source code */
    code: string;
    /** The preview/demo code that uses the component */
    previewCode: string;
    /** Whether the editor is read-only */
    readOnly?: boolean;
    /** Callback when user saves */
    onSave?: (files: Record<string, { code: string }>) => void;
    /** Callback when code changes */
    onCodeChange?: (files: Record<string, { code: string }>) => void;
    /** NPM dependencies for the component */
    dependencies?: Record<string, string>;
    /** Code for registry dependencies (e.g. shadcn components) */
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>;
    /** Component name (used for file path) */
    componentName: string;
    /** Example ID for this instance (used for instance management) */
    exampleId?: string;
    /** Current save status */
    saveStatus?: SaveStatus;
    /** Display name shown in toolbar */
    componentDisplayName?: string;
    /** Description shown in toolbar */
    componentDescription?: string;
}

// =============================================================================
// Constants
// =============================================================================

const EXTERNAL_RESOURCES = [
    // Google Fonts used by tweakcn themes
    "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Source+Serif+4:wght@200..900&family=Geist+Mono:wght@100..900&family=Bricolage+Grotesque:wght@200..800&family=Playfair+Display:wght@400..900&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@100..700&family=Fira+Code:wght@300..700&family=Space+Grotesk:wght@300..700&family=Source+Code+Pro:wght@200..900&family=Outfit:wght@100..900&family=Poppins:wght@100..900&family=DM+Sans:wght@100..900&family=Lora:wght@400..700&family=Merriweather:wght@300..900&family=Rubik:wght@300..900&family=Space+Mono:wght@400;700&family=Archivo:wght@100..900&family=Inconsolata:wght@200..900&family=Montserrat:wght@100..900&family=Lato:wght@100..900&family=Nunito:wght@200..900&family=Quicksand:wght@300..700&family=Raleway:wght@100..900&family=Work+Sans:wght@100..900&family=Karla:wght@200..800&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&family=VT323&family=Courier+Prime:wght@400;700&display=swap",
];

const DEFAULT_DEPENDENCIES = {
    "tailwind-merge": "latest",
    "tw-animate-css": "^1.4.0",
};

// =============================================================================
// Copy Code Button Component (lives inside SandpackProvider)
// =============================================================================

function CopyCodeButton() {
    const { sandpack } = useSandpack();
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        const activeFile = sandpack.activeFile;
        const file = sandpack.files[activeFile];
        const code = typeof file === 'string' ? file : file.code;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    }, [sandpack.activeFile, sandpack.files]);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    className="copy-code-btn absolute top-12 right-2 z-10 shadow-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border rounded-md flex items-center justify-center w-8 h-8 transition-colors"
                    onClick={handleCopy}
                    aria-label="Copy code"
                >
                    {copied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </button>
            </TooltipTrigger>
            <TooltipContent>
                {copied ? "Copied!" : "Copy code"}
            </TooltipContent>
        </Tooltip>
    );
}

// =============================================================================
// CSS Updater Component (updates index.html when CSS theme changes)
// =============================================================================

function CssUpdater({
    effectiveCss,
    isDark,
}: {
    effectiveCss: string;
    isDark: boolean;
}) {
    const { sandpack } = useSandpack();
    const prevCssRef = useRef(effectiveCss);
    const prevIsDarkRef = useRef(isDark);

    // Update index.html when CSS changes (for style theme changes)
    // For Vite, we update /index.html with inline theme CSS
    useEffect(() => {
        if (prevCssRef.current !== effectiveCss || prevIsDarkRef.current !== isDark) {
            const newIndexHtml = getIndexHtml(effectiveCss, isDark);
            sandpack.updateFile("/index.html", newIndexHtml);
            prevCssRef.current = effectiveCss;
            prevIsDarkRef.current = isDark;
        }
    }, [effectiveCss, isDark, sandpack]);

    return null;
}

// =============================================================================
// Registry Tab Marker Component (marks registry dependency tabs)
// =============================================================================

function RegistryTabMarker({
    componentPath,
    registryDependenciesCode
}: {
    componentPath: string;
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>
}) {
    const { sandpack } = useSandpack();
    const prevActiveFileRef = useRef(sandpack.activeFile);

    useEffect(() => {
        if (!registryDependenciesCode) return;

        const registryPaths = Object.keys(registryDependenciesCode).map(
            name => `/src/components/ui/${name}.tsx`
        );

        const markTabs = () => {
            // Find all tab buttons in both editor containers
            const containers = document.querySelectorAll('.editor-container, .readonly-editor-container');

            containers.forEach((container) => {
                // Only select the actual tab buttons, not the tab containers
                const tabButtons = container.querySelectorAll(
                    '[role="tab"] > button, button[class*="tab-button"]'
                );

                tabButtons.forEach((button) => {
                    const title = button.getAttribute('title') || button.getAttribute('aria-label') || '';
                    const textContent = button.textContent || '';
                    const buttonElement = button as HTMLElement;

                    // Find the parent [role="tab"] element
                    const tabElement = buttonElement.closest('[role="tab"]') as HTMLElement;

                    // Check if this tab is a registry dependency (but not the main component)
                    const isRegistryDependency = registryPaths.some(
                        path => {
                            const fileName = path.split('/').pop() || '';
                            return (title.includes(path) || title.includes(fileName) || textContent.includes(fileName))
                                && path !== componentPath;
                        }
                    );

                    if (isRegistryDependency && tabElement) {
                        // Set attribute on the parent tab element, not just the button
                        tabElement.setAttribute('data-registry-dependency', 'true');
                        buttonElement.setAttribute('data-registry-dependency', 'true');
                    } else {
                        if (tabElement) {
                            tabElement.removeAttribute('data-registry-dependency');
                        }
                        buttonElement.removeAttribute('data-registry-dependency');
                    }
                });
            });
        };

        // Mark tabs initially and on changes
        markTabs();

        // Reduced frequency from 500ms to 2000ms for better performance
        const interval = setInterval(markTabs, 2000);

        // Also mark when active file changes - reduced from 200ms to 500ms
        const checkInterval = setInterval(() => {
            if (sandpack.activeFile !== prevActiveFileRef.current) {
                prevActiveFileRef.current = sandpack.activeFile;
                setTimeout(markTabs, 100);
            }
        }, 500);

        return () => {
            clearInterval(interval);
            clearInterval(checkInterval);
        };
    }, [sandpack.activeFile, componentPath, registryDependenciesCode]);

    return null;
}

// =============================================================================
// Internal Toolbar Component (lives inside SandpackProvider)
// =============================================================================

type LocalSaveStatus = 'saved' | 'unsaved';

interface InternalToolbarProps {
    readOnly?: boolean;
    saveStatus: SaveStatus;
    onSave?: (files: Record<string, { code: string }>) => void;
    onCodeChange?: (files: Record<string, { code: string }>) => void;
    componentDisplayName?: string;
    componentDescription?: string;
    lastSavedFiles?: Record<string, { code: string }>;
    onLastSavedUpdate?: (files: Record<string, { code: string }>, showToast?: boolean) => void;
    globalCss?: string;
    componentName?: string;
    exampleId?: string;
    initialFiles?: Record<string, { code: string }>;
    localSaveStatus?: LocalSaveStatus;
    onLocalSaveStatusChange?: (status: LocalSaveStatus) => void;
}

function InternalToolbar({
    readOnly,
    saveStatus,
    onSave,
    onCodeChange,
    componentDisplayName,
    componentDescription,
    lastSavedFiles,
    onLastSavedUpdate,
    globalCss: propGlobalCss,
    componentName,
    exampleId = "default",
    initialFiles,
    localSaveStatus = 'saved',
    onLocalSaveStatusChange,
}: InternalToolbarProps) {
    const { sandpack } = useSandpack();

    // Get globalCss from sandpack files if not provided as prop
    // For Vite, CSS is embedded in index.html
    const globalCss = useMemo(() => {
        if (propGlobalCss) return propGlobalCss;
        const htmlFile = sandpack.files["/index.html"];
        if (htmlFile) {
            const html = typeof htmlFile === "string" ? htmlFile : htmlFile.code;
            // Extract CSS from <style type="text/tailwindcss"> block
            const match = html.match(/<style type="text\/tailwindcss">\s*([\s\S]*?)\s*<\/style>/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        return undefined;
    }, [propGlobalCss, sandpack.files]);
    const saveStatusRef = useRef(saveStatus);

    // Keep ref in sync with saveStatus
    useEffect(() => {
        saveStatusRef.current = saveStatus;
    }, [saveStatus]);

    // Update last saved files when save is successful (manual saves only)
    // This effect only runs when saveStatus changes to 'saved', not on every file change
    const prevSaveStatusRef = useRef(saveStatus);
    useEffect(() => {
        // Only trigger on transition from non-saved to saved (manual save)
        if (saveStatus === 'saved' && prevSaveStatusRef.current !== 'saved' && onLastSavedUpdate) {
            // Create a snapshot of current files as the last saved state
            const savedFiles: Record<string, { code: string }> = {};
            for (const [path, file] of Object.entries(sandpack.files)) {
                const fileCode = typeof file === 'string' ? file : file.code;
                savedFiles[path] = { code: fileCode };
            }
            
            // Only update if files actually changed
            const savedFilesSerialized = JSON.stringify(savedFiles);
            const lastSavedSerialized = lastSavedFiles ? JSON.stringify(lastSavedFiles) : "";
            
            if (savedFilesSerialized !== lastSavedSerialized) {
                // Manual save - show toast
                onLastSavedUpdate(savedFiles, true);
            }
        }
        prevSaveStatusRef.current = saveStatus;
    }, [saveStatus, sandpack.files, onLastSavedUpdate, lastSavedFiles]);

    // Track if there are unsaved changes or cached data in localStorage
    // Use a ref to cache the comparison result and only recalculate when dependencies change
    const hasChangesRef = useRef(false);
    const lastFilesHashRef = useRef<string>("");
    const lastSavedHashRef = useRef<string>("");
    
    const hasChanges = useMemo(() => {
        // Check if there's cached data in localStorage (even if current files match)
        // This allows reset button to be enabled when there's data to reset
        // Only check localStorage if we don't have lastSavedFiles (which means cache exists)
        const hasCachedData = !lastSavedFiles && typeof window !== "undefined" && componentName &&
            getComponentCache(componentName, exampleId) !== undefined;
        
        if (!lastSavedFiles) {
            // If we have cached data but no lastSavedFiles loaded yet, enable reset
            const result = !!hasCachedData;
            hasChangesRef.current = result;
            return result;
        }

        const currentFiles = sandpack.files;
        const savedFiles = lastSavedFiles;

        // Helper to get code from file (handles both string and object formats)
        const getFileCode = (file: string | { code: string } | { code: string; hidden?: boolean }): string => {
            return typeof file === 'string' ? file : file.code;
        };

        // Create simple hash of current files (only user-editable files)
        const currentHash = Object.entries(savedFiles)
            .map(([path]) => {
                const currentFile = currentFiles[path];
                if (!currentFile) return '';
                return `${path}:${getFileCode(currentFile)}`;
            })
            .sort()
            .join('|');
        
        // Create hash of saved files
        const savedHash = Object.entries(savedFiles)
            .map(([path, file]) => `${path}:${getFileCode(file)}`)
            .sort()
            .join('|');
        
        // Only recalculate if hashes changed
        const filesChanged = currentHash !== lastFilesHashRef.current;
        const savedChanged = savedHash !== lastSavedHashRef.current;
        
        if (filesChanged) {
            lastFilesHashRef.current = currentHash;
        }
        if (savedChanged) {
            lastSavedHashRef.current = savedHash;
        }
        
        // Compare hashes to detect changes
        const hasFileChanges = currentHash !== savedHash;
        const result = hasFileChanges || !!hasCachedData;
        
        // Update ref
        hasChangesRef.current = result;
        
        return result;
    }, [sandpack.files, lastSavedFiles, componentName, exampleId]);

    const handleSave = useCallback(() => {
        if (onSave) {
            onSave(sandpack.files);
        }
        if (onCodeChange) {
            onCodeChange(sandpack.files);
        }
        // Note: lastSavedFiles will be updated when saveStatus becomes 'saved'
    }, [onSave, onCodeChange, sandpack.files]);

    // Helper to snapshot current Sandpack files into the in-memory cache and
    // re-apply them. This is used when changing style themes, toggling
    // light/dark mode, or navigating between components.
    const snapshotCurrentFilesToCache = useCallback(() => {
        const savedFiles: Record<string, { code: string }> = {};
        for (const [path, file] of Object.entries(sandpack.files)) {
            const fileCode = typeof file === "string" ? file : file.code;
            savedFiles[path] = { code: fileCode };
        }

        if (onLastSavedUpdate) {
            // Snapshot for theme/component changes - no toast needed
            onLastSavedUpdate(savedFiles, false);
        }

        // Re-apply saved files to Sandpack to ensure they are in sync
        for (const [path, file] of Object.entries(savedFiles)) {
            sandpack.updateFile(path, file.code);
        }
    }, [onLastSavedUpdate, sandpack.files, sandpack.updateFile]);

    const handleReset = useCallback(() => {
        // Clear localStorage cache for this component instance
        if (componentName) {
            clearComponentCache(componentName, exampleId);
        }

        // Reset to initial files if provided, otherwise reset active file
        if (initialFiles && Object.keys(initialFiles).length > 0) {
            // Reset all files to initial state
            for (const [path, file] of Object.entries(initialFiles)) {
                sandpack.updateFile(path, file.code);
            }
        } else if (lastSavedFiles) {
            // Fallback to last saved state
            for (const [path, file] of Object.entries(lastSavedFiles)) {
                sandpack.updateFile(path, file.code);
            }
        } else {
            // Final fallback: reset active file
            sandpack.resetFile(sandpack.activeFile);
        }

        // Notify parent to clear the cache
        if (onLastSavedUpdate && initialFiles) {
            // Reset - no toast needed here, toast is shown above
            onLastSavedUpdate(initialFiles, false);
        }

        // Reset local save status to saved after reset
        if (onLocalSaveStatusChange) {
            onLocalSaveStatusChange('saved');
        }

        // Show toast notification
        toast.info("Reset to initial state", {
            description: "All changes have been cleared and files reset to initial state.",
        });
    }, [sandpack, lastSavedFiles, initialFiles, componentName, exampleId, onLastSavedUpdate]);

    // Auto-save every 30 seconds when there are unsaved changes
    useEffect(() => {
        // Only auto-save if there are changes and not currently saving
        if (!hasChanges || saveStatusRef.current === 'saving' || !onSave) {
            return;
        }

        const autoSaveInterval = setInterval(() => {
            // Double-check that we still have changes and aren't saving
            // Use ref to get current saveStatus value
            if (saveStatusRef.current !== 'saving') {
                handleSave();
            }
        }, 30000); // 30 seconds

        return () => {
            clearInterval(autoSaveInterval);
        };
    }, [hasChanges, handleSave, onSave]);

    // Track previous files to detect actual changes
    const prevFilesRef = useRef<string>("");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Notify parent of code changes and auto-save to localStorage (debounced)
    // Only save if files actually changed to avoid unnecessary localStorage writes
    useEffect(() => {
        // Clear any pending save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(() => {
            // Normalize files to ensure they have a code property
            const normalizedFiles: Record<string, { code: string }> = {};
            for (const [path, file] of Object.entries(sandpack.files)) {
                normalizedFiles[path] = {
                    code: typeof file === 'string' ? file : file.code
                };
            }
            
            // Serialize files to compare with previous state
            const filesSerialized = JSON.stringify(normalizedFiles);
            const hasChanged = filesSerialized !== prevFilesRef.current;
            
            if (!hasChanged) {
                // No changes, skip saving
                return;
            }
            
            // Mark as unsaved when files change
            if (onLocalSaveStatusChange) {
                onLocalSaveStatusChange('unsaved');
            }
            
            // Update ref with new state
            prevFilesRef.current = filesSerialized;
            
            // Notify parent if callback provided
            if (onCodeChange) {
                onCodeChange(normalizedFiles);
            }
            
            // Auto-save to localStorage only when files actually changed
            // This ensures user edits persist even without explicit save
            // but avoids unnecessary writes when nothing changed
            // Only show toast for auto-saves if we're not already in a save operation
            if (onLastSavedUpdate && saveStatusRef.current !== 'saving') {
                onLastSavedUpdate(normalizedFiles, false); // Don't show toast for auto-saves
            }
        }, 1500); // Increased debounce to 1.5s to reduce save frequency

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [sandpack.files, onCodeChange, onLastSavedUpdate, onLocalSaveStatusChange]);

    // Listen for global events that should trigger a cache snapshot, such as
    // light/dark theme toggles or component switches initiated elsewhere
    // (e.g., Sidebar navigation).
    useEffect(() => {
        const handler = () => {
            snapshotCurrentFilesToCache();
        };

        window.addEventListener("tweakcn:before-theme-toggle", handler);
        window.addEventListener("tweakcn:before-component-change", handler);

        return () => {
            window.removeEventListener("tweakcn:before-theme-toggle", handler);
            window.removeEventListener("tweakcn:before-component-change", handler);
        };
    }, [snapshotCurrentFilesToCache]);

        return (
            <EditorToolbar
                componentDisplayName={componentDisplayName}
                componentDescription={componentDescription}
                saveStatus={saveStatus}
                readOnly={readOnly}
                onReset={handleReset}
                onSave={handleSave}
                hasChanges={hasChanges}
                globalCss={globalCss}
                localSaveStatus={localSaveStatus}
            />
        );
}

// =============================================================================
// Hooks
// =============================================================================

function useSandpackFiles(
    componentPath: string,
    code: string,
    previewCode: string,
    effectiveCss: string,
    isDark: boolean,
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>,
    savedFiles?: Record<string, { code: string }>,
    dependencies?: Record<string, string>
) {
    const registryFiles = useMemo(() => {
        if (!registryDependenciesCode) return {};

        const files = Object.entries(registryDependenciesCode).reduce(
            (acc, [name, data]) => ({
                ...acc,
                [`/src/components/ui/${name}.tsx`]: {
                    code: data.code,
                    hidden: false,
                },
            }),
            {} as Record<string, { code: string; hidden: boolean }>
        );

        return files;
    }, [registryDependenciesCode]);

    return useMemo(
        () => {
            // Prefer any cached/saved versions of user-editable files.
            const resolvedPreviewCode =
                savedFiles?.["/src/App.tsx"]?.code ?? previewCode;
            const resolvedComponentCode =
                savedFiles?.[componentPath]?.code ?? code;

            const resolvedRegistryFiles = Object.entries(registryFiles).reduce(
                (acc, [path, file]) => {
                    const cached = savedFiles?.[path];
                    if (cached) {
                        acc[path] = {
                            ...file,
                            code: cached.code,
                        };
                    } else {
                        acc[path] = file;
                    }
                    return acc;
                },
                {} as Record<string, { code: string; hidden: boolean }>
            );

            return {
                // Vite React files
                "/index.html": getIndexHtml(effectiveCss, isDark),
                "/src/main.tsx": getMainTsx(),
                "/src/App.tsx": getAppTsx(resolvedPreviewCode),
                "/src/index.css": getIndexCss(),
                // Component and dependencies
                [componentPath]: resolvedComponentCode,
                ...resolvedRegistryFiles,
                // Config files
                "/vite.config.ts": {
                    code: getViteConfig(),
                    hidden: true,
                },
                "/tsconfig.json": {
                    code: TSCONFIG_CODE,
                    hidden: true,
                },
                // Utility files
                "/src/lib/utils.ts": {
                    code: UTILS_CODE,
                    hidden: true,
                },
                "/src/hooks/use-mobile.ts": {
                    code: USE_MOBILE_CODE,
                    hidden: true,
                },
            };
        },
        [componentPath, isDark, effectiveCss, code, previewCode, registryFiles, savedFiles, dependencies]
    );
}

function useSandpackOptions(
    componentPath: string,
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>
) {
    const registryFilePaths = useMemo(() => {
        if (!registryDependenciesCode) return [];
        return Object.keys(registryDependenciesCode).map(name => `/src/components/ui/${name}.tsx`);
    }, [registryDependenciesCode]);

    return useMemo(
        () => ({
            externalResources: EXTERNAL_RESOURCES,
            activeFile: "/src/App.tsx",
            visibleFiles: [
                "/src/App.tsx",
                componentPath,
                ...registryFilePaths,
            ],
            autoReload: true,
            autorun: true,
            recompileMode: "immediate" as const,
            recompileDelay: 0,
        }),
        [componentPath, registryFilePaths]
    );
}

function useSandpackSetup(
    dependencies?: Record<string, string>,
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>
) {
    const serializedDeps = JSON.stringify(dependencies);
    const serializedRegistryDeps = JSON.stringify(registryDependenciesCode);

    return useMemo(() => {
        // Collect all NPM dependencies from registry components
        const registryNpmDeps = registryDependenciesCode
            ? Object.values(registryDependenciesCode).reduce((acc, component) => {
                return { ...acc, ...(component.dependencies || {}) };
            }, {} as Record<string, string>)
            : {};

        // Base dependencies for Vite React TypeScript
        const baseDependencies = {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "@vitejs/plugin-react": "^4.2.0",
            "typescript": "^5.6.3",
            "vite": "^5.0.0",
            "clsx": "^2.1.1",
            "lucide-react": "latest",
        };

        const allDependencies = {
            ...baseDependencies,
            ...DEFAULT_DEPENDENCIES,
            ...registryNpmDeps,
            ...(dependencies || {}),
        };

        return {
            dependencies: allDependencies,
        };
    }, [serializedDeps, serializedRegistryDeps]);
}


// =============================================================================
// Main Component
// =============================================================================

export default function ComponentEditor({
    code,
    previewCode,
    readOnly,
    onSave,
    onCodeChange,
    dependencies,
    registryDependenciesCode,
    componentName,
    exampleId = "default",
    saveStatus = "idle",
    componentDisplayName,
    componentDescription,
}: ComponentEditorProps) {
    const { resolvedTheme } = useTheme();
    const { globalCss } = useGlobalCss();
    const componentPath = `/src/components/ui/${componentName}.tsx`;
    
    // Create a stable instance key for the SandpackProvider
    const instanceKey = `${componentName}-${exampleId}`;
    
    // Track dark mode from DOM since ThemeToggle uses direct DOM manipulation
    // This ensures we stay in sync with the actual dark mode state
    const [isDarkFromDom, setIsDarkFromDom] = useState(false);
    
    useEffect(() => {
        // Initial check
        setIsDarkFromDom(document.documentElement.classList.contains('dark'));
        
        // Watch for class changes on the html element
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkFromDom(document.documentElement.classList.contains('dark'));
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
        
        return () => observer.disconnect();
    }, []);

    // Track last saved files state for this component instance.
    // We seed it from localStorage so edits persist across page reloads and navigation.
    // Use lazy initializer to load from cache only once on mount
    const [lastSavedFiles, setLastSavedFiles] = useState<Record<string, { code: string }> | undefined>(() => {
        // Load from localStorage on mount (client-side only)
        // This runs only once during initialization
        if (typeof window !== "undefined") {
            return getComponentCache(componentName, exampleId);
        }
        return undefined;
    });

    // Track local save status (saved/unsaved) for badge display
    // Use lazy initializer to check cache only once
    const [localSaveStatus, setLocalSaveStatus] = useState<'saved' | 'unsaved'>(() => {
        // If we have cached files, assume they're saved
        // Check the same cache that was loaded above to avoid duplicate reads
        if (typeof window !== "undefined") {
            const cached = getComponentCache(componentName, exampleId);
            return cached ? 'saved' : 'saved';
        }
        return 'saved'; // Default to saved on initial load
    });

    // Computed values
    // Use DOM-based dark mode detection since ThemeToggle uses direct DOM manipulation
    // Fall back to resolvedTheme for next-themes compatibility
    const isDark = useMemo(() => {
        // Prefer DOM-based detection as it's more reliable with current ThemeToggle implementation
        return isDarkFromDom || (resolvedTheme === "dark");
    }, [isDarkFromDom, resolvedTheme]);

    // Use global CSS from context
    const effectiveCss = globalCss;

    // Sandpack configuration - files should only update when source data changes.
    // Sandpack will handle live updates internally when user edits in the editor.
    const files = useSandpackFiles(
        componentPath,
        code,
        previewCode,
        effectiveCss,
        isDark,
        registryDependenciesCode,
        lastSavedFiles,
        dependencies
    );
    const options = useSandpackOptions(componentPath, registryDependenciesCode);
    const customSetup = useSandpackSetup(dependencies, registryDependenciesCode);

    // Create a hash of source data to detect meaningful changes to the "source of truth"
    // for files (initial code/preview/registry). Theme and style changes are handled
    // via CssUpdater and the Sandpack theme prop so they don't wipe user edits.
    const sourceDataKey = useMemo(() => {
        const registryHash = registryDependenciesCode
            ? Object.keys(registryDependenciesCode).join(',')
            : '';
        return `${componentPath}|${code}|${previewCode}|${registryHash}`;
    }, [componentPath, code, previewCode, registryDependenciesCode]);

    // Initialize / re-baseline last saved files when the underlying source data
    // changes, but only if we don't already have a cache for this component instance.
    // Theme changes are handled separately so we don't overwrite the localStorage
    // cache of the user's current edits.
    useEffect(() => {
        if (lastSavedFiles && Object.keys(lastSavedFiles).length > 0) {
            return;
        }
        if (files && Object.keys(files).length > 0) {
            // Create a deep copy of the files for last saved state
            const savedFiles: Record<string, { code: string }> = {};
            for (const [path, file] of Object.entries(files)) {
                savedFiles[path] = { code: typeof file === 'string' ? file : file.code };
            }
            setLastSavedFiles(savedFiles);
            // Initial setup - no toast needed
            setComponentCache(componentName, savedFiles, exampleId);
        }
    }, [code, previewCode, registryDependenciesCode, componentName, exampleId, files, lastSavedFiles]);

    // Note: lastSavedFiles is updated in InternalEditor when saveStatus becomes 'saved'

    // Key for SandpackProvider - use stable key based on instance
    // This allows React to potentially reuse the instance when navigating back
    const providerKey = useMemo(() => `sandpack-${instanceKey}`, [instanceKey]);

    // Suppress non-critical Sandpack service worker errors
    // These errors occur when Sandpack tries to use its cloud bundler but can't communicate
    // They're non-critical because Sandpack falls back to local bundling
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const errorMessage = event.message || '';
            const errorSource = event.filename || '';
            
            // Suppress Sandpack service worker BroadcastChannel timeout errors
            if (
                errorMessage.includes('BroadcastChannel') &&
                errorMessage.includes('timeout') &&
                (errorSource.includes('__csb_sw') || errorSource.includes('sandpack'))
            ) {
                event.preventDefault();
                return false;
            }
            
            // Suppress Sandpack bundler POST request failures
            if (
                errorMessage.includes('Failed to handle POST') &&
                errorMessage.includes('codesandbox.io')
            ) {
                event.preventDefault();
                return false;
            }
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            const errorMessage = typeof reason === 'string' 
                ? reason 
                : reason?.message || '';
            
            // Suppress Sandpack service worker promise rejections
            if (
                errorMessage.includes('BroadcastChannel') &&
                errorMessage.includes('timeout')
            ) {
                event.preventDefault();
                return false;
            }
            
            if (
                errorMessage.includes('Failed to handle POST') &&
                errorMessage.includes('codesandbox.io')
            ) {
                event.preventDefault();
                return false;
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return (
        <div className="w-full flex flex-col">
            <SandpackProvider
                key={providerKey}
                template="vite-react-ts"
                theme={isDark ? "dark" : "light"}
                files={files}
                options={options}
                customSetup={customSetup}
                style={{ display: "flex", flexDirection: "column" }}
            >
                {/* CSS Updater - updates index.html when CSS theme changes */}
                <CssUpdater effectiveCss={effectiveCss} isDark={isDark} />

                {/* Toolbar - outside SandpackLayout but inside SandpackProvider */}
                {!readOnly && (
                    <InternalToolbar
                        componentDisplayName={componentDisplayName}
                        componentDescription={componentDescription}
                        saveStatus={saveStatus}
                        readOnly={readOnly}
                        onSave={onSave}
                        onCodeChange={onCodeChange}
                        lastSavedFiles={lastSavedFiles}
                        onLastSavedUpdate={(files, showToast = false) => {
                            // Keep the existing state of file contents
                            setLastSavedFiles(files);
                            // Also store them in localStorage for persistence
                            setComponentCache(componentName, files, exampleId);
                            // Mark as saved after successful save
                            setLocalSaveStatus('saved');
                        }}
                        globalCss={effectiveCss}
                        componentName={componentName}
                        exampleId={exampleId}
                        localSaveStatus={localSaveStatus}
                        onLocalSaveStatusChange={setLocalSaveStatus}
                        initialFiles={useMemo(() => {
                            // Create initial files snapshot from the original source files (not cached)
                            // This is used for reset functionality - restore to original state
                            const initial: Record<string, { code: string }> = {};
                            
                            // Registry files
                            const registryFiles: Record<string, { code: string }> = {};
                            if (registryDependenciesCode) {
                                for (const [name, data] of Object.entries(registryDependenciesCode)) {
                                    registryFiles[`/src/components/ui/${name}.tsx`] = { code: data.code };
                                }
                            }
                            
                            // Build complete initial file set from original source
                            initial["/index.html"] = { code: getIndexHtml(effectiveCss, isDark) };
                            initial["/src/main.tsx"] = { code: getMainTsx() };
                            initial["/src/App.tsx"] = { code: getAppTsx(previewCode) };
                            initial["/src/index.css"] = { code: getIndexCss() };
                            initial[componentPath] = { code: code };
                            initial["/vite.config.ts"] = { code: getViteConfig() };
                            initial["/tsconfig.json"] = { code: TSCONFIG_CODE };
                            initial["/src/lib/utils.ts"] = { code: UTILS_CODE };
                            initial["/src/hooks/use-mobile.ts"] = { code: USE_MOBILE_CODE };
                            
                            // Add registry files
                            Object.assign(initial, registryFiles);
                            
                            return initial;
                        }, [componentPath, code, previewCode, effectiveCss, isDark, registryDependenciesCode])}
                    />
                )}

                {/* Editor and Preview using SandpackLayout for proper live updates */}
                <SandpackLayout style={{ height: "500px", display: "flex", overflow: "hidden" }}>
                    {/* Editor Panel */}
                    <div
                        className={readOnly ? "readonly-editor-container" : "editor-container"}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                            minHeight: 0,
                            height: "100%",
                            position: "relative"
                        }}
                    >
                        <CopyCodeButton />
                        <RegistryTabMarker
                            componentPath={componentPath}
                            registryDependenciesCode={registryDependenciesCode}
                        />
                        <SandpackCodeEditor
                            showTabs
                            showLineNumbers
                            showInlineErrors
                            wrapContent={false}
                            readOnly={readOnly}
                            style={{
                                flex: "1 1 auto",
                                minHeight: 0,
                                height: "100%",
                                width: "100%"
                            }}
                        />
                    </div>

                    {/* Preview Panel with styling */}
                    <div className="flex-1 p-4 bg-muted/30 flex items-center justify-center" style={{ minWidth: 0, minHeight: 0, overflow: "hidden" }}>
                        <div className="h-full w-full bg-background rounded-lg overflow-auto shadow-sm border border-border/50">
                            <SandpackPreview
                                style={{ height: "100%", width: "100%" }}
                                showOpenInCodeSandbox={true}
                                showRefreshButton
                            />
                        </div>
                    </div>
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
}
