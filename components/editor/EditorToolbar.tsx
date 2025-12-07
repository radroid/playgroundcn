"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { SaveStatus } from "./SaveStatusIndicator";

interface EditorToolbarProps {
    componentDisplayName?: string;
    componentDescription?: string;
    saveStatus: SaveStatus;
    readOnly?: boolean;
    onReset: () => void;
    onSave: () => void;
    hasChanges?: boolean;
}

export function EditorToolbar({
    readOnly,
    onReset,
    hasChanges = false,
}: EditorToolbarProps) {
    return (
        <div className="bg-muted/50 border-b border-border shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                {/* Empty left side or could be used for something else */}
                <div className="flex items-center gap-2 min-w-0 shrink" />

                {/* Actions */}
                {!readOnly && (
                    <div className="flex items-center gap-1">
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
    );
}
