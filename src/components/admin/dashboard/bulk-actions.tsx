"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Download, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    generateInvoice,
    generateInvoiceDataFromOrder,
} from "@/lib/invoice-generator";

interface BulkActionsProps {
    data: Record<string, unknown>[];
    selectedItems: string[];
    itemType: "products" | "orders" | "users";
    onDelete?: (ids: string[]) => Promise<any>;
    deleteLoading?: string[];
}

export function BulkActions({
    data,
    selectedItems,
    itemType,
    onDelete,
    deleteLoading = [],
}: BulkActionsProps) {
    const handleBulkAction = async (action: string) => {
        switch (action) {
            case "delete":
                if (!onDelete) {
                    toast.error("Delete function not implemented.");
                    return;
                }

                try {
                    const result = await onDelete(selectedItems);
                    // Note: Success/error toasts are handled in the parent component
                } catch {
                    toast.error("Failed to delete items.");
                }
                break;
            case "generate-invoices":
                try {
                    toast.loading(
                        `Generating ${selectedItems.length} invoices...`,
                        { id: "bulk-invoices" }
                    );

                    // Get the selected orders
                    const selectedOrders = data.filter(
                        (item: Record<string, unknown>) =>
                            selectedItems.includes(item.id as string)
                    );

                    // Generate invoices for each selected order
                    selectedOrders.forEach(
                        (order: Record<string, unknown>, index: number) => {
                            setTimeout(() => {
                                const invoiceData =
                                    generateInvoiceDataFromOrder(order);
                                generateInvoice(invoiceData);
                            }, index * 500); // Stagger the downloads to avoid browser blocking
                        }
                    );

                    toast.success(
                        `Generated ${selectedItems.length} invoices successfully!`,
                        { id: "bulk-invoices" }
                    );
                } catch {
                    toast.error("Failed to generate invoices", {
                        id: "bulk-invoices",
                    });
                }
                break;
            default:
                toast.error("Invalid action.");
        }
    };

    const disabled = selectedItems.length === 0;
    const hasDeleteLoading = selectedItems.some((id) =>
        deleteLoading.includes(id)
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || hasDeleteLoading}
                >
                    {hasDeleteLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Bulk Actions"
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {itemType === "products" && (
                    <DropdownMenuItem
                        onClick={() => handleBulkAction("edit")}
                        disabled={hasDeleteLoading}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() => handleBulkAction("download")}
                    disabled={hasDeleteLoading}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleBulkAction("delete")}
                    disabled={hasDeleteLoading}
                >
                    {hasDeleteLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </>
                    )}
                </DropdownMenuItem>
                {itemType === "orders" && (
                    <DropdownMenuItem
                        onClick={() => handleBulkAction("generate-invoices")}
                        disabled={hasDeleteLoading}
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Invoices
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
