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
import { getAppCode, UTILS_CODE, TSCONFIG_CODE, USE_MOBILE_CODE } from "@/lib/sandpack/sandpack-app-template";
import { getComponentCache, setComponentCache } from "./cache";
import { useGlobalCss } from "@/lib/context/global-css-context";

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
    "https://cdn.tailwindcss.com?plugins=forms,typography",
    // Google Fonts used by tweakcn themes
    "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Source+Serif+4:wght@200..900&family=Geist+Mono:wght@100..900&family=Bricolage+Grotesque:wght@200..800&family=Playfair+Display:wght@400..900&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@100..700&family=Fira+Code:wght@300..700&family=Space+Grotesk:wght@300..700&family=Source+Code+Pro:wght@200..900&family=Outfit:wght@100..900&family=Poppins:wght@100..900&family=DM+Sans:wght@100..900&family=Lora:wght@400..700&family=Merriweather:wght@300..900&family=Rubik:wght@300..900&family=Space+Mono:wght@400;700&family=Archivo:wght@100..900&family=Inconsolata:wght@200..900&family=Montserrat:wght@100..900&family=Lato:wght@100..900&family=Nunito:wght@200..900&family=Quicksand:wght@300..700&family=Raleway:wght@100..900&family=Work+Sans:wght@100..900&family=Karla:wght@200..800&family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&family=VT323&family=Courier+Prime:wght@400;700&display=swap",
];

const DEFAULT_DEPENDENCIES = {
    "lucide-react": "latest",
    clsx: "latest",
    "tailwind-merge": "latest",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
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
// CSS Updater Component (updates globals.css when CSS theme changes)
// =============================================================================

function CssUpdater({
    effectiveCss,
}: {
    effectiveCss: string;
}) {
    const { sandpack } = useSandpack();
    const prevCssRef = useRef(effectiveCss);

    // Update globals.css when CSS changes (for style theme changes)
    useEffect(() => {
        if (prevCssRef.current !== effectiveCss) {
            sandpack.updateFile("/styles/globals.css", effectiveCss);
            prevCssRef.current = effectiveCss;
        }
    }, [effectiveCss, sandpack]);

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
            name => `/components/ui/${name}.tsx`
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

interface InternalToolbarProps {
    readOnly?: boolean;
    saveStatus: SaveStatus;
    onSave?: (files: Record<string, { code: string }>) => void;
    onCodeChange?: (files: Record<string, { code: string }>) => void;
    componentDisplayName?: string;
    componentDescription?: string;
    lastSavedFiles?: Record<string, { code: string }>;
    onLastSavedUpdate?: (files: Record<string, { code: string }>) => void;
    globalCss?: string;
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
}: InternalToolbarProps) {
    const { sandpack } = useSandpack();

    // Get globalCss from sandpack files if not provided as prop
    const globalCss = useMemo(() => {
        if (propGlobalCss) return propGlobalCss;
        const cssFile = sandpack.files["/styles/globals.css"];
        if (cssFile) {
            return typeof cssFile === "string" ? cssFile : cssFile.code;
        }
        return undefined;
    }, [propGlobalCss, sandpack.files]);
    const saveStatusRef = useRef(saveStatus);

    // Keep ref in sync with saveStatus
    useEffect(() => {
        saveStatusRef.current = saveStatus;
    }, [saveStatus]);

    // Update last saved files when save is successful
    useEffect(() => {
        if (saveStatus === 'saved' && onLastSavedUpdate) {
            // Create a snapshot of current files as the last saved state
            const savedFiles: Record<string, { code: string }> = {};
            for (const [path, file] of Object.entries(sandpack.files)) {
                const fileCode = typeof file === 'string' ? file : file.code;
                savedFiles[path] = { code: fileCode };
            }
            onLastSavedUpdate(savedFiles);
        }
    }, [saveStatus, sandpack.files, onLastSavedUpdate]);

    // Track if there are unsaved changes
    const hasChanges = useMemo(() => {
        if (!lastSavedFiles) return false;

        const currentFiles = sandpack.files;
        const savedFiles = lastSavedFiles;

        // Helper to get code from file (handles both string and object formats)
        const getFileCode = (file: string | { code: string } | { code: string; hidden?: boolean }): string => {
            return typeof file === 'string' ? file : file.code;
        };

        // Only compare files we actually track in lastSavedFiles.
        // Ignore any additional internal files Sandpack may create.
        for (const [path, savedFile] of Object.entries(savedFiles)) {
            const currentFile = currentFiles[path];
            if (!currentFile) continue;

            const currentCode = getFileCode(currentFile);
            const savedCode = getFileCode(savedFile);

            if (currentCode !== savedCode) {
                return true;
            }
        }

        return false;
    }, [sandpack.files, lastSavedFiles]);

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
            onLastSavedUpdate(savedFiles);
        }

        // Re-apply saved files to Sandpack to ensure they are in sync
        for (const [path, file] of Object.entries(savedFiles)) {
            sandpack.updateFile(path, file.code);
        }
    }, [onLastSavedUpdate, sandpack.files, sandpack.updateFile]);

    const handleReset = useCallback(() => {
        if (!lastSavedFiles) {
            // Fallback to resetting to initial if no saved state
            sandpack.resetFile(sandpack.activeFile);
            return;
        }

        // Reset all files to last saved state
        for (const [path, file] of Object.entries(lastSavedFiles)) {
            sandpack.updateFile(path, file.code);
        }
    }, [sandpack, lastSavedFiles]);

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

    // Notify parent of code changes (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onCodeChange) {
                // Normalize files to ensure they have a code property
                const normalizedFiles: Record<string, { code: string }> = {};
                for (const [path, file] of Object.entries(sandpack.files)) {
                    normalizedFiles[path] = {
                        code: typeof file === 'string' ? file : file.code
                    };
                }
                onCodeChange(normalizedFiles);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [sandpack.files, onCodeChange]);

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
    savedFiles?: Record<string, { code: string }>
) {
    const registryFiles = useMemo(() => {
        if (!registryDependenciesCode) return {};

        const files = Object.entries(registryDependenciesCode).reduce(
            (acc, [name, data]) => ({
                ...acc,
                [`/components/ui/${name}.tsx`]: {
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
                savedFiles?.["/Preview.tsx"]?.code ?? previewCode;
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
                "/App.tsx": getAppCode(isDark),
                "/Preview.tsx": resolvedPreviewCode,
                [componentPath]: resolvedComponentCode,
                "/lib/utils.ts": {
                    code: UTILS_CODE,
                    hidden: true,
                },
                // Always use the currently generated/effective CSS for the active theme
                "/styles/globals.css": effectiveCss,
                "/tsconfig.json": {
                    code: TSCONFIG_CODE,
                    hidden: true,
                },
                "/hooks/use-mobile.ts": {
                    code: USE_MOBILE_CODE,
                    hidden: true,
                },
                ...resolvedRegistryFiles,
            };
        },
        [componentPath, isDark, effectiveCss, code, previewCode, registryFiles, savedFiles]
    );
}

function useSandpackOptions(
    componentPath: string,
    registryDependenciesCode?: Record<string, { code: string; dependencies?: Record<string, string> }>
) {
    const registryFilePaths = useMemo(() => {
        if (!registryDependenciesCode) return [];
        return Object.keys(registryDependenciesCode).map(name => `/components/ui/${name}.tsx`);
    }, [registryDependenciesCode]);

    return useMemo(
        () => ({
            externalResources: EXTERNAL_RESOURCES,
            activeFile: "/Preview.tsx",
            visibleFiles: [
                "/Preview.tsx",
                componentPath,
                "/styles/globals.css",
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

        return {
            dependencies: {
                ...DEFAULT_DEPENDENCIES,
                ...registryNpmDeps,
                ...(dependencies || {}),
            },
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
    saveStatus = "idle",
    componentDisplayName,
    componentDescription,
}: ComponentEditorProps) {
    const { resolvedTheme } = useTheme();
    const { globalCss, currentTheme } = useGlobalCss();
    const componentPath = `/components/ui/${componentName}.tsx`;
    
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

    // Track last saved files state for this component. We seed it from the
    // global in-memory cache so edits survive navigation between components
    // within a single session (but not full page reloads).
    const [lastSavedFiles, setLastSavedFiles] = useState<Record<string, { code: string }> | undefined>(() =>
        getComponentCache(componentName)
    );

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
        lastSavedFiles
    );
    const options = useSandpackOptions(componentPath, registryDependenciesCode);
    const customSetup = useSandpackSetup(dependencies, registryDependenciesCode);

    // Use a ref to stabilize files - refs don't trigger re-renders, keeping Sandpack's internal state intact.
    // This is critical: when the files prop changes, Sandpack can reset its internal state and overwrite user edits.
    const stableFilesRef = useRef(files);
    const lastSourceDataRef = useRef<string>("");

    // Create a hash of source data to detect meaningful changes to the "source of truth"
    // for files (initial code/preview/registry). Theme and style changes are handled
    // via CssUpdater and the Sandpack theme prop so they don't wipe user edits.
    const sourceDataKey = useMemo(() => {
        const registryHash = registryDependenciesCode
            ? Object.keys(registryDependenciesCode).join(',')
            : '';
        return `${componentPath}|${code}|${previewCode}|${registryHash}`;
    }, [componentPath, code, previewCode, registryDependenciesCode]);

    // Update ref when source data changes - this updates the files object without triggering re-render
    // Sandpack will sync files via updateFile calls from InternalEditor when needed
    useEffect(() => {
        if (lastSourceDataRef.current !== sourceDataKey) {
            lastSourceDataRef.current = sourceDataKey;
            stableFilesRef.current = files;
        }
    }, [sourceDataKey, files]);

    // Initialize / re-baseline last saved files when the underlying source data
    // changes, but only if we don't already have a cache for this component.
    // Theme changes are handled separately so we don't overwrite the in-memory
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
            setComponentCache(componentName, savedFiles);
        }
    }, [code, previewCode, registryDependenciesCode, currentTheme, componentName, files, lastSavedFiles]);

    // Note: lastSavedFiles is updated in InternalEditor when saveStatus becomes 'saved'

    // Key for SandpackProvider - include isDark so Sandpack remounts with correct editor theme
    // Note: Remounting will reset user edits, which is acceptable for theme changes
    const registryHash = registryDependenciesCode
        ? Object.keys(registryDependenciesCode).join(',')
        : '';
    const providerKey = `sandpack-${sourceDataKey}-${isDark ? "dark" : "light"}-${registryHash}`;

    return (
        <div className="w-full flex flex-col">
            <SandpackProvider
                key={providerKey}
                template="react-ts"
                theme={isDark ? "dark" : "light"}
                files={files}
                options={options}
                customSetup={customSetup}
                style={{ display: "flex", flexDirection: "column" }}
            >
                {/* CSS Updater - updates globals.css when CSS theme changes (not dark mode) */}
                <CssUpdater effectiveCss={effectiveCss} />

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
                        onLastSavedUpdate={(files) => {
                            // Keep the existing in-memory cache of file contents
                            setLastSavedFiles(files);
                            // Also store them in the global in-memory cache
                            setComponentCache(componentName, files);
                        }}
                        globalCss={effectiveCss}
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
                        <div className="h-full w-full bg-background rounded-lg overflow-hidden shadow-sm border border-border/50">
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
