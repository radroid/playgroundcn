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
import { useState } from "react";
import { SaveStatus } from "./SaveStatusIndicator";
import SaveStatusIndicator from "./SaveStatusIndicator";
import { clearAllComponentCaches } from "./storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LocalSaveStatus = 'saved' | 'unsaved';

interface EditorToolbarProps {
    componentDisplayName?: string;
    componentDescription?: string;
    saveStatus: SaveStatus;
    readOnly?: boolean;
    onReset: () => void;
    onSave: () => void;
    hasChanges?: boolean;
    hasChangesFromOriginal?: boolean;
    globalCss?: string;
    localSaveStatus?: LocalSaveStatus;
    isMobile?: boolean;
    isTablet?: boolean;
}

export function EditorToolbar({
    readOnly,
    onReset,
    hasChanges = false,
    hasChangesFromOriginal = false,
    saveStatus,
    localSaveStatus = 'saved',
    isMobile = false,
    isTablet = false,
}: EditorToolbarProps) {
    // Always use props - never call hooks in conditionally rendered components
    // This ensures consistent hook counts
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [showResetAllDialog, setShowResetAllDialog] = useState(false);

    const handleResetClick = () => {
        setShowResetDialog(true);
    };

    const handleResetConfirm = () => {
        onReset();
        setShowResetDialog(false);
        toast.success("Component reset to original Shadcn code");
    };

    const handleResetAllClick = () => {
        setShowResetAllDialog(true);
    };

    const handleResetAllLocalStorage = () => {
        clearAllComponentCaches();
        setShowResetAllDialog(false);
        toast.success("All components reset to original state");
        // Reload the page to reflect changes
        window.location.reload();
    };

    return (
        <div className="bg-muted/50 border-b border-border shrink-0">
            <div className={cn(
                "flex flex-wrap items-center justify-between gap-x-4 gap-y-2",
                // Responsive padding
                isMobile ? "px-2 py-2" : isTablet ? "px-3 py-2.5" : "px-4 py-3"
            )}>
                {/* Left side - Save status and local save badge */}
                <div className="flex items-center gap-2 min-w-0 shrink">
                    <SaveStatusIndicator status={saveStatus} hasChanges={hasChanges} />
                    {localSaveStatus === 'saved' && !isMobile && (
                        <Badge variant="outline" className={cn(
                            "text-xs",
                            isTablet && "text-[10px] px-1.5 py-0"
                        )}>
                            Saved locally
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                {!readOnly && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                isMobile ? "h-6 w-6" : isTablet ? "h-7 w-7" : "h-7 w-7"
                            )}
                            onClick={handleResetClick}
                            title="Reset to original Shadcn code"
                            disabled={!hasChangesFromOriginal}
                        >
                            <RotateCcw className={cn(
                                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
                            )} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Reset Component Dialog */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Component?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all your code changes for this component and reset it to the original Shadcn component code (the initial load state). 
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

            {/* Reset All Components Dialog */}
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
        </div>
    );
}
