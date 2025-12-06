"use client";

import { Button } from "@/components/ui/button";
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
    globalCss?: string;
    localSaveStatus?: LocalSaveStatus;
}

export function EditorToolbar({
    readOnly,
    onReset,
    hasChanges = false,
    globalCss,
    localSaveStatus = 'saved',
}: EditorToolbarProps) {

    const [isToastShowing, setIsToastShowing] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showResetAllDialog, setShowResetAllDialog] = useState(false);
    const TOAST_ID = 'local-storage-info';

    const handleBadgeClick = useCallback(() => {
        if (localSaveStatus !== 'saved') return;

        // If toast is already showing, dismiss it first
        if (isToastShowing) {
            toast.dismiss(TOAST_ID);
            setIsToastShowing(false);
            // Small delay to ensure old toast is dismissed before showing new one
            setTimeout(() => {
                showToast();
            }, 100);
            return;
        }

        showToast();

        function showToast() {
            // Show persistent toast
            toast.info(
                <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="font-medium flex-1">Your edits are saved locally</div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                toast.dismiss(TOAST_ID);
                                setIsToastShowing(false);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Your code changes are stored in your browser's local storage. To clear them, use the reset button for individual components or reset all components below.
                    </div>
                    <div className="mt-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowResetAllDialog(true);
                            }}
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Reset All Local Storage
                        </Button>
                    </div>
                </div>,
                {
                    duration: Infinity, // Persistent until dismissed
                    id: TOAST_ID,
                    onDismiss: () => {
                        setIsToastShowing(false);
                    },
                }
            );
            setIsToastShowing(true);
        }
    }, [localSaveStatus, isToastShowing]);

    const handleResetClick = useCallback(() => {
        setShowResetDialog(true);
    }, []);

    const handleResetConfirm = useCallback(() => {
        setShowResetDialog(false);
        onReset();
    }, [onReset]);

    const handleResetAllLocalStorage = useCallback(() => {
        // Clear all component caches from localStorage
        clearAllComponentCaches();
        
        // Show success toast
        toast.success("All local storage cleared", {
            description: "All components have been reset to their original state.",
            duration: 3000,
        });
        
        // Close the dialog
        setShowResetAllDialog(false);
        
        // Dismiss the info toast if it's showing
        toast.dismiss(TOAST_ID);
        setIsToastShowing(false);
        
        // Reload the page to reflect the changes
        window.location.reload();
    }, []);

    const handleDownloadCss = useCallback(() => {
        if (!globalCss) return;

        const blob = new Blob([globalCss], {
            type: "text/css;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "globals.css";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [globalCss]);

    return (
        <>
            <div className="bg-muted/50 border-b border-border shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                    {/* Left side - Local save status badges */}
                    <div className="flex items-center gap-2 min-w-0 shrink">
                        {!readOnly && (
                            <>
                                {localSaveStatus === 'saved' ? (
                                    <Badge 
                                        variant="outline" 
                                        className="gap-1.5 cursor-pointer hover:bg-accent transition-colors"
                                        onClick={handleBadgeClick}
                                        title="Click to learn about local storage"
                                    >
                                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                                        <span className="text-xs">Saved locally</span>
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="gap-1.5">
                                        <Circle className="h-3 w-3 text-orange-500 fill-orange-500 animate-pulse" />
                                        <span className="text-xs">Unsaved changes</span>
                                    </Badge>
                                )}
                            </>
                        )}
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
