import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Type for export options
export type ExportFormat = "csv" | "excel" | "pdf";

// Generic export function
export async function exportData<T extends Record<string, any>>(
    data: T[],
    format: ExportFormat,
    filename: string,
    columns?: { key: keyof T; header: string }[]
) {
    // Generate default columns if not provided
    if (!columns && data.length > 0) {
        columns = Object.keys(data[0]).map((key) => ({
            key: key as keyof T,
            header:
                key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1"),
        }));
    }

    switch (format) {
        case "csv":
            return exportToCsv(data, filename, columns);
        case "excel":
            return exportToExcel(data, filename, columns);
        case "pdf":
            return exportToPdf(data, filename, columns);
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}

// CSV Export - using browser's built-in functionality
function exportToCsv<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
) {
    if (!columns || columns.length === 0) {
        throw new Error("Columns configuration is required for CSV export");
    }

    // Create header row
    let csvContent = columns.map((col) => `"${col.header}"`).join(",") + "\r\n";

    // Add data rows
    data.forEach((item) => {
        const row = columns!.map((col) => {
            const value = item[col.key];
            // Handle different data types and ensure proper CSV formatting
            if (value === null || value === undefined) return '""';
            if (Object.prototype.toString.call(value) === "[object Date]")
                return `"${(value as Date).toLocaleDateString()}"`;
            if (typeof value === "object")
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(",") + "\r\n";
    });

    // Create and download the file using browser's built-in functionality
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Use browser's built-in download functionality
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Excel Export - simplified without external dependencies
function exportToExcel<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
) {
    if (!columns || columns.length === 0) {
        throw new Error("Columns configuration is required for Excel export");
    }

    try {
        // Prepare the worksheet data
        const wsData = [
            // Header row
            columns.map((col) => col.header),
            // Data rows
            ...data.map((item) =>
                columns!.map((col) => {
                    const value = item[col.key];
                    if (value === null || value === undefined) return "";
                    if (
                        Object.prototype.toString.call(value) ===
                        "[object Date]"
                    )
                        return (value as Date).toLocaleDateString();
                    if (typeof value === "object") return JSON.stringify(value);
                    return value;
                })
            ),
        ];

        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        // Generate the Excel file and trigger download
        XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
        console.error("Excel export failed:", error);
        // Fallback to CSV if Excel export fails
        exportToCsv(data, filename, columns);
    }
}

// PDF Export - simplified version without external dependencies
function exportToPdf<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { key: keyof T; header: string }[]
) {
    if (!columns || columns.length === 0) {
        throw new Error("Columns configuration is required for PDF export");
    }

    try {
        // Create a new PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(filename, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        // Prepare the table data
        const tableColumn = columns.map((col) => col.header);
        const tableRows = data.map((item) =>
            columns!.map((col) => {
                const value = item[col.key];
                if (value === null || value === undefined) return "";
                if (Object.prototype.toString.call(value) === "[object Date]")
                    return (value as Date).toLocaleDateString();
                if (typeof value === "object") return JSON.stringify(value);
                return String(value);
            })
        );

        // Add the table to the PDF using autoTable
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: "grid",
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [255, 102, 0],
                textColor: 255,
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        // Save the PDF
        doc.save(`${filename}.pdf`);
    } catch (error) {
        console.error("PDF export failed:", error);
        // Fallback to CSV if PDF export fails
        exportToCsv(data, filename, columns);
    }
}

// Helper function to format data for export
export function formatDataForExport<T extends Record<string, any>>(
    data: T[],
    columnConfig: { [key in keyof T]?: string }
): { data: Record<string, any>[]; columns: { key: string; header: string }[] } {
    const columns = Object.entries(columnConfig).map(([key, header]) => ({
        key,
        header: header || key,
    }));

    const formattedData = data.map((item) => {
        const newItem: Record<string, any> = {};
        for (const [key] of Object.entries(columnConfig)) {
            newItem[key] = item[key as keyof T];
        }
        return newItem;
    });

    return { data: formattedData, columns };
}

// Function to generate column configurations for different entity types
export function getExportColumns(
    entityType:
        | "products"
        | "orders"
        | "users"
        | "reports"
        | "inventory"
        | "messages"
) {
    switch (entityType) {
        case "products":
            return {
                id: "Product ID",
                name: "Product Name",
                category: "Category",
                brand: "Brand",
                price: "Price",
                stock: "Stock",
                status: "Status",
                rating: "Rating",
                createdDate: "Created Date",
            };
        case "orders":
            return {
                id: "Order ID",
                customer: "Customer",
                email: "Email",
                date: "Order Date",
                status: "Status",
                payment: "Payment",
                priority: "Priority",
                items: "Items",
                total: "Total",
                shippingMethod: "Shipping Method",
            };
        case "users":
            return {
                id: "User ID",
                name: "Name",
                email: "Email",
                role: "Role",
                status: "Status",
                tier: "Tier",
                orders: "Orders",
                spent: "Total Spent",
                location: "Location",
                joined: "Join Date",
                lastLogin: "Last Login",
            };
        case "reports":
            return {
                id: "Report ID",
                name: "Report Name",
                type: "Type",
                period: "Period",
                status: "Status",
                size: "Size",
                generated: "Generated Date",
            };
        case "inventory":
            return {
                id: "Item ID",
                name: "Item Name",
                category: "Category",
                quantity: "Quantity",
                location: "Location",
                status: "Status",
                lastUpdated: "Last Updated",
            };
        case "messages":
            return {
                id: "Message ID",
                sender: "Sender",
                recipient: "Recipient",
                subject: "Subject",
                date: "Date",
                status: "Status",
                priority: "Priority",
            };
        default:
            return {};
    }
}
