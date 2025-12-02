"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { RotateCcw } from "lucide-react";
import { ThemeSelector } from "./ThemeSelector";
import { SaveStatus } from "./SaveStatusIndicator";

interface EditorToolbarProps {
    componentDisplayName?: string;
    componentDescription?: string;
    currentTheme: string;
    onThemeChange: (theme: string) => void;
    saveStatus: SaveStatus;
    readOnly?: boolean;
    onReset: () => void;
    onSave: () => void;
    hasChanges?: boolean;
    globalCss?: string;
}

export function EditorToolbar({
    currentTheme,
    onThemeChange,
    readOnly,
    onReset,
    hasChanges = false,
    globalCss,
}: EditorToolbarProps) {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const nextThemeRef = React.useRef<string | null>(null);

    // Listen for theme-change requests that require confirmation
    React.useEffect(() => {
        const handler = (event: Event) => {
            const custom = event as CustomEvent<{
                nextTheme: string;
                apply: () => void;
            }>;

            nextThemeRef.current = custom.detail.nextTheme;
            // Store apply callback on ref so we can call it after confirm
            (nextThemeRef as any).apply = custom.detail.apply;
            setConfirmOpen(true);
        };

        window.addEventListener("tweakcn:confirm-theme-change", handler as EventListener);
        return () => {
            window.removeEventListener("tweakcn:confirm-theme-change", handler as EventListener);
        };
    }, []);

    const handleConfirm = React.useCallback(() => {
        const apply = (nextThemeRef as any).apply as (() => void) | undefined;
        if (apply) {
            apply();
        } else if (nextThemeRef.current) {
            onThemeChange(nextThemeRef.current);
        }
        setConfirmOpen(false);
        nextThemeRef.current = null;
        (nextThemeRef as any).apply = undefined;
    }, [onThemeChange]);

    return (
        <>
            <div className="bg-muted/50 border-b border-border shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                    {/* Empty left side or could be used for something else */}
                    <div className="flex items-center gap-2 min-w-0 shrink" />

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <div className="flex items-center gap-2">
                            {!readOnly && (
                                <ThemeSelector
                                    currentTheme={currentTheme}
                                    onThemeChange={onThemeChange}
                                    globalCss={globalCss}
                                    hasUnsavedChanges={hasChanges}
                                />
                            )}
                        </div>

                        {!readOnly && (
                            <div className="flex items-center gap-1">
                                <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={onReset}
                                    title="Reset to initial state"
                                    disabled={!hasChanges}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard current changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Changing the style or theme will reset the editor and you will lose all
                            unsaved changes to the preview, component, and related files.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Discard changes and continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
