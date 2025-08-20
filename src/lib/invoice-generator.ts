import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
    order: {
        id: string;
        customer: string;
        email: string;
        date: string;
        status: string;
        payment: string;
        total: number;
        items: number;
        priority: string;
        shippingMethod: string;
    };
    company: {
        name: string;
        address: string;
        city: string;
        phone: string;
        email: string;
        website: string;
    };
    customer: {
        name: string;
        email: string;
        address?: string;
        city?: string;
        phone?: string;
    };
    items: {
        id: string;
        name: string;
        description?: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    billing: {
        subtotal: number;
        tax: number;
        taxRate: number;
        shipping: number;
        discount?: number;
        total: number;
    };
}

export function generateInvoice(invoiceData: InvoiceData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colors
    const primaryColor: [number, number, number] = [255, 102, 0]; // Orange from RANGVA brand
    const textColor: [number, number, number] = [51, 51, 51];
    const lightGray: [number, number, number] = [245, 245, 245];

    // Header Section
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("RANGVA", 20, 25);

    // Invoice Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", pageWidth - 60, 25);

    // Company Information
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let yPos = 55;
    doc.text(invoiceData.company.name, 20, yPos);
    doc.text(invoiceData.company.address, 20, yPos + 5);
    doc.text(invoiceData.company.city, 20, yPos + 10);
    doc.text(`Phone: ${invoiceData.company.phone}`, 20, yPos + 15);
    doc.text(`Email: ${invoiceData.company.email}`, 20, yPos + 20);
    doc.text(`Website: ${invoiceData.company.website}`, 20, yPos + 25);

    // Invoice Details (Right side)
    const invoiceDetailsX = pageWidth - 80;
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", invoiceDetailsX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoiceData.order.id}`, invoiceDetailsX, yPos + 8);
    doc.text(
        `Date: ${new Date(invoiceData.order.date).toLocaleDateString()}`,
        invoiceDetailsX,
        yPos + 16
    );
    doc.text(
        `Due Date: ${new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString()}`,
        invoiceDetailsX,
        yPos + 24
    );
    doc.text(`Status: ${invoiceData.order.status}`, invoiceDetailsX, yPos + 32);

    // Bill To Section
    yPos = 95;
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, pageWidth - 40, 8, "F");

    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 25, yPos + 5);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.customer.name, 25, yPos);
    doc.text(invoiceData.customer.email, 25, yPos + 8);
    if (invoiceData.customer.address) {
        doc.text(invoiceData.customer.address, 25, yPos + 16);
    }
    if (invoiceData.customer.city) {
        doc.text(invoiceData.customer.city, 25, yPos + 24);
    }
    if (invoiceData.customer.phone) {
        doc.text(`Phone: ${invoiceData.customer.phone}`, 25, yPos + 32);
    }

    // Items Table
    yPos = 150;
    const tableColumns = ["Item", "Description", "Qty", "Price", "Total"];
    const tableRows = invoiceData.items.map((item) => [
        item.name,
        item.description || "",
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${item.total.toFixed(2)}`,
    ]);

    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPos,
        theme: "grid",
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        columnStyles: {
            0: { cellWidth: 60 }, // Item
            1: { cellWidth: 60 }, // Description
            2: { cellWidth: 20, halign: "center" }, // Qty
            3: { cellWidth: 25, halign: "right" }, // Price
            4: { cellWidth: 25, halign: "right" }, // Total
        },
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;

    // Totals Section
    const totalsX = pageWidth - 80;
    let totalsY = finalY + 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Subtotal
    doc.text("Subtotal:", totalsX - 30, totalsY);
    doc.text(`$${invoiceData.billing.subtotal.toFixed(2)}`, totalsX, totalsY, {
        align: "right",
    });

    // Shipping
    totalsY += 8;
    doc.text("Shipping:", totalsX - 30, totalsY);
    doc.text(`$${invoiceData.billing.shipping.toFixed(2)}`, totalsX, totalsY, {
        align: "right",
    });

    // Discount (if applicable)
    if (invoiceData.billing.discount && invoiceData.billing.discount > 0) {
        totalsY += 8;
        doc.text("Discount:", totalsX - 30, totalsY);
        doc.text(
            `-$${invoiceData.billing.discount.toFixed(2)}`,
            totalsX,
            totalsY,
            { align: "right" }
        );
    }

    // Tax
    totalsY += 8;
    doc.text(
        `Tax (${(invoiceData.billing.taxRate * 100).toFixed(1)}%):`,
        totalsX - 30,
        totalsY
    );
    doc.text(`$${invoiceData.billing.tax.toFixed(2)}`, totalsX, totalsY, {
        align: "right",
    });

    // Total line
    totalsY += 12;
    doc.setLineWidth(0.5);
    doc.line(totalsX - 35, totalsY - 2, totalsX + 5, totalsY - 2);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", totalsX - 30, totalsY);
    doc.text(`$${invoiceData.billing.total.toFixed(2)}`, totalsX, totalsY, {
        align: "right",
    });

    // Payment Information
    totalsY += 25;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information:", 20, totalsY);

    doc.setFont("helvetica", "normal");
    doc.text(`Payment Status: ${invoiceData.order.payment}`, 20, totalsY + 8);
    doc.text(`Payment Method: Credit Card`, 20, totalsY + 16);
    doc.text(
        `Shipping Method: ${invoiceData.order.shippingMethod}`,
        20,
        totalsY + 24
    );

    // Footer
    const footerY = pageHeight - 30;
    doc.setFillColor(...primaryColor);
    doc.rect(0, footerY, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", pageWidth / 2, footerY + 10, {
        align: "center",
    });
    doc.text(
        `Questions? Contact us at ${invoiceData.company.email} or ${invoiceData.company.phone}`,
        pageWidth / 2,
        footerY + 18,
        { align: "center" }
    );

    // Save the PDF
    doc.save(`Invoice-${invoiceData.order.id}.pdf`);
}

// Helper function to generate sample invoice data from order
export function generateInvoiceDataFromOrder(order: any): InvoiceData {
    // Sample company data - you can replace this with actual company information
    const companyData = {
        name: "RANGVA Corporation",
        address: "123 Business Street",
        city: "New York, NY 10001",
        phone: "+1 (555) 123-4567",
        email: "billing@rangva.com",
        website: "www.rangva.com",
    };

    // Sample customer data - in a real app, this would come from your customer database
    const customerData = {
        name: order.customer,
        email: order.email,
        address: "456 Customer Avenue",
        city: "Customer City, ST 12345",
        phone: "+1 (555) 987-6543",
    };

    // Generate sample items based on order data
    const items = generateSampleItems(order.items, order.total);

    // Calculate billing details
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.08; // 8% tax rate
    const shipping = order.shippingMethod === "Express" ? 15.99 : 5.99;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shipping;

    return {
        order,
        company: companyData,
        customer: customerData,
        items,
        billing: {
            subtotal,
            tax,
            taxRate,
            shipping,
            total,
        },
    };
}

// Helper function to generate sample items
function generateSampleItems(itemCount: number, orderTotal: number) {
    const sampleProducts = [
        {
            name: "Wireless Headphones",
            description: "Premium noise-canceling headphones",
        },
        { name: "Smart Watch", description: "Fitness tracking smartwatch" },
        {
            name: "Laptop Stand",
            description: "Adjustable aluminum laptop stand",
        },
        { name: "USB-C Cable", description: "High-speed charging cable" },
        { name: "Bluetooth Speaker", description: "Portable wireless speaker" },
        { name: "Phone Case", description: "Protective silicone case" },
        { name: "Wireless Charger", description: "Fast wireless charging pad" },
        { name: "Tablet Stylus", description: "Precision stylus pen" },
    ];

    const items = [];
    const basePrice = (orderTotal * 0.85) / itemCount; // 85% of total for items, 15% for tax/shipping

    for (let i = 0; i < itemCount; i++) {
        const product = sampleProducts[i % sampleProducts.length];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = basePrice / quantity;

        items.push({
            id: `ITEM-${String(i + 1).padStart(3, "0")}`,
            name: product.name,
            description: product.description,
            quantity,
            price,
            total: price * quantity,
        });
    }

    return items;
}
