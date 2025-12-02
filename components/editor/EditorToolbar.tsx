"use client";

import { Button } from "@/components/ui/button";
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
    return (
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
    );
}
