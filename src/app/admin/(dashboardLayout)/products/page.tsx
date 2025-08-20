"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BulkActions } from "@/components/admin/dashboard/bulk-actions";
import { useToast } from "@/hooks/use-toast";
import {
    ProductTable,
    ProductListHeader,
    ProductsPageHeader,
    useProductFilters,
    useProductData,
} from "@/components/admin/dashboard/products/listing";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const { toast } = useToast();

    // Use custom hooks for data management
    const {
        products,
        categories,
        loading,
        error,
        deleteLoading,
        loadData,
        handleProductUpdate,
        handleProductDelete,
        handleBulkDelete,
        setProducts,
    } = useProductData();

    const { filterGroups, getFilteredProducts } = useProductFilters(
        products,
        categories
    );

    // Get filtered products
    const filteredProducts = useMemo(() => {
        return getFilteredProducts(searchTerm, filters);
    }, [getFilteredProducts, searchTerm, filters]);

    // Selection handlers
    const handleSelectProduct = (productId: string, checked: boolean) => {
        if (checked) {
            setSelectedProducts((prev) => [...prev, productId]);
        } else {
            setSelectedProducts((prev) =>
                prev.filter((id) => id !== productId)
            );
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProducts(filteredProducts.map((p) => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    // Filter handlers
    const handleClearFilters = () => {
        setSearchTerm("");
        setFilters({});
    };

    const handleRetry = () => {
        setSearchTerm("");
        setFilters({});
        loadData();
    };

    // Product delete handler that also removes from selected
    const handleProductDeleteWithSelection = async (
        productId: string,
        token?: string
    ) => {
        const result = await handleProductDelete(productId, token);
        if (result.success) {
            setSelectedProducts((prev) =>
                prev.filter((id) => id !== productId)
            );
        }
        return result;
    };

    // Bulk delete handler that also clears selection
    const handleBulkDeleteWithSelection = async (
        ids: string[],
        token?: string
    ) => {
        const result = await handleBulkDelete(ids, token);

        if (result.success) {
            toast({
                title: "Products deleted",
                description: result.message,
            });
            setSelectedProducts([]);
        } else if (result.successCount > 0) {
            toast({
                title: "Partial success",
                description: result.message,
                variant: "destructive",
            });
            setSelectedProducts([]);
        } else {
            toast({
                title: "Delete failed",
                description: result.message,
                variant: "destructive",
            });
        }

        return result;
    };

    return (
        <div className="space-y-6">
            <ProductsPageHeader
                products={products}
                selectedProducts={selectedProducts}
            />

            <Card>
                <ProductListHeader
                    totalProducts={filteredProducts.length}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    filters={filters}
                    filterGroups={filterGroups}
                    onSearchChange={setSearchTerm}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                    onRetry={handleRetry}
                />

                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <BulkActions
                        data={products as any[]}
                        selectedItems={selectedProducts}
                        itemType="products"
                        onDelete={handleBulkDeleteWithSelection}
                        deleteLoading={deleteLoading}
                    />

                    <ProductTable
                        products={filteredProducts}
                        loading={loading}
                        error={error}
                        selectedProducts={selectedProducts}
                        deleteLoading={deleteLoading}
                        onSelectProduct={handleSelectProduct}
                        onSelectAll={handleSelectAll}
                        onProductUpdate={handleProductUpdate}
                        onProductDelete={handleProductDeleteWithSelection}
                        onRetry={handleRetry}
                        onClearFilters={handleClearFilters}
                    />

                    {filteredProducts.length === 0 && !loading && !error && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No products found matching your criteria.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
