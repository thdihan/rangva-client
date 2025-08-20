"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import {
    generateInvoice,
    generateInvoiceDataFromOrder,
} from "@/lib/invoice-generator";
import { toast } from "sonner";

interface InvoiceButtonProps {
    order: Record<string, unknown>;
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg";
    showText?: boolean;
}

export function InvoiceButton({
    order,
    variant = "ghost",
    size = "sm",
    showText = true,
}: InvoiceButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateInvoice = async () => {
        try {
            setIsGenerating(true);
            toast.loading("Generating invoice...", {
                id: "invoice-generation",
            });

            // Generate invoice data from order
            const invoiceData = generateInvoiceDataFromOrder(order);

            // Generate and download the PDF
            generateInvoice(invoiceData);

            toast.success("Invoice generated successfully!", {
                id: "invoice-generation",
            });
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice. Please try again.", {
                id: "invoice-generation",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleGenerateInvoice}
            disabled={isGenerating}
            className="flex items-center gap-1"
        >
            {isGenerating ? (
                <Download className="h-4 w-4 animate-spin" />
            ) : (
                <FileText className="h-4 w-4" />
            )}
            {showText && (isGenerating ? "Generating..." : "Invoice")}
        </Button>
    );
}
