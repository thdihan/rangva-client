"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductActions } from "@/components/admin/dashboard/action-dialogs";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product.types";

interface ProductTableProps {
    products: Product[];
    loading: boolean;
    error: string | null;
    selectedProducts: string[];
    deleteLoading?: string[];
    onSelectProduct: (productId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onProductUpdate: (updatedProduct: any) => void;
    onProductDelete: (
        productId: string,
        token?: string
    ) => Promise<{ success: boolean; message: string }>;
    onRetry: () => void;
    onClearFilters: () => void;
}

// Helper function to get status display text and style
const getProductStatus = (product: Product) => {
    const stock = Number(product.stock) || 0;
    const minStock = Number(product.minStock) || 0;

    if (stock === 0) {
        return {
            text: "Out of Stock",
            style: "border-red-500 text-red-700 bg-red-50",
        };
    } else if (stock <= minStock) {
        return {
            text: "Low Stock",
            style: "border-yellow-500 text-yellow-700 bg-yellow-50",
        };
    } else if (product.isActive) {
        return {
            text: "Active",
            style: "border-green-500 text-green-700 bg-green-50",
        };
    } else {
        return {
            text: "Inactive",
            style: "border-gray-500 text-gray-700 bg-gray-50",
        };
    }
};

// Helper function to get brand name (from attributes or placeholder)
const getBrandName = (product: Product) => {
    return (
        product.attributes?.brand ||
        product.attributes?.manufacturer ||
        "No Brand"
    );
};

// Helper function to get average rating
const getAverageRating = (product: Product): number => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
};

export function ProductTable({
    products,
    loading,
    error,
    selectedProducts,
    deleteLoading = [],
    onSelectProduct,
    onSelectAll,
    onProductUpdate,
    onProductDelete,
    onRetry,
    onClearFilters,
}: ProductTableProps) {
    const { toast } = useToast();

    // Wrapper function to handle async delete for ProductActions component
    const handleDelete = async (productId: string) => {
        try {
            const result = await onProductDelete(productId);
            if (result.success) {
                toast({
                    title: "Product deleted",
                    description:
                        result.message ||
                        "Product has been successfully deleted.",
                });
            } else {
                toast({
                    title: "Delete failed",
                    description: result.message || "Failed to delete product.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast({
                title: "Error",
                description:
                    "An unexpected error occurred while deleting the product.",
                variant: "destructive",
            });
        }
    };
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox
                            checked={
                                selectedProducts.length === products.length &&
                                products.length > 0
                            }
                            onCheckedChange={onSelectAll}
                        />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p className="text-gray-500">Loading products...</p>
                        </TableCell>
                    </TableRow>
                ) : products.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                            <p className="text-gray-500">
                                {error
                                    ? "Failed to load products. Please try again."
                                    : "No products found matching your criteria."}
                            </p>
                            <Button
                                variant="outline"
                                className="mt-2"
                                onClick={error ? onRetry : onClearFilters}
                            >
                                {error ? "Retry" : "Clear all filters"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ) : (
                    products.map((product) => {
                        const status = getProductStatus(product);
                        const avgRating = getAverageRating(product);

                        return (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedProducts.includes(
                                            product.id
                                        )}
                                        onCheckedChange={(checked) =>
                                            onSelectProduct(
                                                product.id,
                                                checked as boolean
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                "📦"
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.sku || product.id}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {product.category?.name || "No Category"}
                                </TableCell>
                                <TableCell>{getBrandName(product)}</TableCell>
                                <TableCell className="font-medium">
                                    $
                                    {product.price
                                        ? Number(product.price).toFixed(2)
                                        : "0.00"}
                                    {product.salePrice &&
                                        Number(product.salePrice) <
                                            Number(product.price) && (
                                            <div className="text-sm text-green-600">
                                                Sale: $
                                                {Number(
                                                    product.salePrice
                                                ).toFixed(2)}
                                            </div>
                                        )}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        {product.stock || 0}
                                        {product.trackStock && (
                                            <div className="text-xs text-gray-500">
                                                Min: {product.minStock || 0}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <span>⭐</span>
                                        <span>{avgRating.toFixed(1)}</span>
                                        {product.reviews && (
                                            <span className="text-xs text-gray-500">
                                                ({product.reviews.length})
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={status.style}
                                    >
                                        {status.text}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <ProductActions
                                        product={
                                            {
                                                ...product,
                                                brand: getBrandName(product),
                                                rating: avgRating,
                                                status: status.text,
                                                image:
                                                    product.thumbnail || "📦",
                                                createdDate: product.createdAt,
                                            } as any
                                        }
                                        onUpdate={onProductUpdate}
                                        onDelete={() =>
                                            handleDelete(product.id)
                                        }
                                        deleteLoading={deleteLoading.includes(
                                            product.id
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })
                )}
            </TableBody>
        </Table>
    );
}
