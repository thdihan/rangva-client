"use client";

import { Button } from "@/components/ui/button";

interface ProductActionsProps {
    onSave: () => void;
    onSaveAsDraft: () => void;
    isLoading?: boolean;
}

export default function ProductActions({
    onSave,
    onSaveAsDraft,
    isLoading = false,
}: ProductActionsProps) {
    return (
        <div className="flex gap-3">
            <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                onClick={onSave}
                disabled={isLoading}
            >
                {isLoading ? "Saving..." : "Save Product"}
            </Button>
            <Button
                variant="outline"
                className="flex-1"
                onClick={onSaveAsDraft}
                disabled={isLoading}
            >
                Save as Draft
            </Button>
        </div>
    );
}
