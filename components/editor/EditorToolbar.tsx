"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { useCallback, useState } from "react";
import * as React from "react";
import { Download, RotateCcw, CheckCircle2, Circle, X, Trash2 } from "lucide-react";
import { SaveStatus } from "./SaveStatusIndicator";
import { toast } from "sonner";
import { clearAllComponentCaches } from "./storage";

type LocalSaveStatus = 'saved' | 'unsaved';

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

                    {/* Actions */}
                    {!readOnly && (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={handleResetClick}
                                title="Reset to initial state"
                                disabled={hasChanges === false}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={handleDownloadCss}
                                title="Download current global CSS"
                                disabled={!globalCss}
                            >
                                <Download className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Download CSS
                                </span>
                                <span className="sm:hidden">CSS</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Component?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all your code changes for this component and reset it to the original Shadcn state. 
                            All changes stored in your browser's local storage for this component will be lost. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleResetConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Reset Component
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showResetAllDialog} onOpenChange={setShowResetAllDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset All Components?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all your code changes for <strong>all components</strong> on this website and reset them to their original Shadcn state. 
                            All changes stored in your browser's local storage will be lost. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleResetAllLocalStorage}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Reset All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
