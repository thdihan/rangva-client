"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    exportData,
    getExportColumns,
    type ExportFormat,
} from "@/lib/export-utils";

interface ExportMenuProps<T extends Record<string, unknown>> {
    data: T[];
    entityType:
        | "products"
        | "orders"
        | "users"
        | "reports"
        | "inventory"
        | "messages";
    selectedItems?: T[];
    filename?: string;
    className?: string;
}

export function ExportMenu<T extends Record<string, unknown>>({
    data,
    entityType,
    selectedItems,
    filename,
    className,
}: ExportMenuProps<T>) {
    const [showColumnDialog, setShowColumnDialog] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
    const [customFilename, setCustomFilename] = useState(
        filename || entityType
    );
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();

    const exportColumns = getExportColumns(entityType);
    const exportData_ =
        selectedItems && selectedItems.length > 0 ? selectedItems : data;

    const handleQuickExport = async (format: ExportFormat) => {
        if (exportData_.length === 0) {
            toast({
                title: "No data to export",
                description:
                    "Please select items to export or ensure data is available.",
                variant: "destructive",
            });
            return;
        }

        setIsExporting(true);
        try {
            const columns = Object.entries(exportColumns).map(
                ([key, header]) => ({
                    key: key as keyof T,
                    header,
                })
            );

            const timestamp = new Date().toISOString().split("T")[0];
            const exportFilename = `${
                customFilename || entityType
            }-${timestamp}`;

            await exportData(exportData_, format, exportFilename, columns);

            toast({
                title: "Export successful",
                description: `${
                    exportData_.length
                } items exported as ${format.toUpperCase()}`,
            });
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export failed",
                description:
                    "There was an error exporting your data. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleCustomExport = (format: ExportFormat) => {
        setSelectedFormat(format);
        setSelectedColumns(Object.keys(exportColumns));
        setShowColumnDialog(true);
    };

    const executeCustomExport = async () => {
        if (selectedColumns.length === 0) {
            toast({
                title: "No columns selected",
                description: "Please select at least one column to export.",
                variant: "destructive",
            });
            return;
        }

        setIsExporting(true);
        try {
            const columns = selectedColumns.map((key) => ({
                key: key as keyof T,
                header: exportColumns[key as keyof typeof exportColumns] || key,
            }));

            const timestamp = new Date().toISOString().split("T")[0];
            const exportFilename =
                customFilename || `${entityType}-${timestamp}`;

            await exportData(
                exportData_,
                selectedFormat,
                exportFilename,
                columns
            );

            toast({
                title: "Export successful",
                description: `${
                    exportData_.length
                } items exported as ${selectedFormat.toUpperCase()}`,
            });

            setShowColumnDialog(false);
        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export failed",
                description:
                    "There was an error exporting your data. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const toggleColumn = (columnKey: string) => {
        setSelectedColumns((prev) =>
            prev.includes(columnKey)
                ? prev.filter((key) => key !== columnKey)
                : [...prev, columnKey]
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={className}
                        disabled={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isExporting ? "Exporting..." : "Export"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleQuickExport("csv")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleQuickExport("excel")}
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickExport("pdf")}>
                        <File className="h-4 w-4 mr-2" />
                        Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCustomExport("csv")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Custom CSV Export
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleCustomExport("excel")}
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Custom Excel Export
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCustomExport("pdf")}>
                        <File className="h-4 w-4 mr-2" />
                        Custom PDF Export
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Customize Export</DialogTitle>
                        <DialogDescription>
                            Choose which columns to include in your{" "}
                            {selectedFormat.toUpperCase()} export.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="filename">Filename</Label>
                            <Input
                                id="filename"
                                value={customFilename}
                                onChange={(e) =>
                                    setCustomFilename(e.target.value)
                                }
                                placeholder={`${entityType}-export`}
                            />
                        </div>

                        <div>
                            <Label>Columns to Export</Label>
                            <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                                {Object.entries(exportColumns).map(
                                    ([key, header]) => (
                                        <div
                                            key={key}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={key}
                                                checked={selectedColumns.includes(
                                                    key
                                                )}
                                                onCheckedChange={() =>
                                                    toggleColumn(key)
                                                }
                                            />
                                            <Label
                                                htmlFor={key}
                                                className="text-sm font-normal"
                                            >
                                                {header}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowColumnDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={executeCustomExport}
                            disabled={isExporting}
                        >
                            {isExporting
                                ? "Exporting..."
                                : `Export ${selectedFormat.toUpperCase()}`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
