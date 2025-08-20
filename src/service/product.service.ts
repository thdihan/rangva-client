"use client";

import {
    CreateProductData,
    UpdateProductData,
    ProductFilters,
    ProductResponse,
    SingleProductResponse,
} from "@/types/product.types";
import { revalidateProducts, revalidateTags } from "@/service/actions/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/**
 * Create a product with potential file handling (Client-side function)
 * This can handle larger payloads and complex data structures
 */
export const createProductService = async (
    data: CreateProductData,
    token?: string
): Promise<SingleProductResponse> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Trigger cache revalidation
    if (result.success) {
        try {
            await revalidateProducts();
        } catch (error) {
            console.warn("Failed to revalidate products cache:", error);
        }
    }

    return result;
};

/**
 * Update a product with potential file handling (Client-side function)
 */
export const updateProductService = async (
    id: string,
    data: Partial<UpdateProductData>,
    token?: string
): Promise<SingleProductResponse> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Trigger cache revalidation
    if (result.success) {
        try {
            await revalidateProducts();
        } catch (error) {
            console.warn("Failed to revalidate products cache:", error);
        }
    }

    return result;
};

/**
 * Bulk operations for products (Client-side function)
 */
export const bulkUpdateProducts = async (
    updates: Array<{ id: string; data: Partial<UpdateProductData> }>,
    token?: string
): Promise<{ success: boolean; results: SingleProductResponse[] }> => {
    const results: SingleProductResponse[] = [];
    let hasError = false;

    for (const update of updates) {
        try {
            const result = await updateProductService(
                update.id,
                update.data,
                token
            );
            results.push(result);
            if (!result.success) {
                hasError = true;
            }
        } catch (error) {
            hasError = true;
            results.push({
                success: false,
                status: 500,
                message: `Failed to update product ${update.id}`,
                data: {} as any,
            });
        }
    }

    return {
        success: !hasError,
        results,
    };
};

/**
 * Delete multiple products (Client-side function)
 */
export const bulkDeleteProducts = async (
    productIds: string[],
    token?: string
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> => {
    let deletedCount = 0;
    const errors: string[] = [];

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    for (const id of productIds) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "DELETE",
                headers,
                cache: "no-store",
            });

            const result = await response.json();

            if (result.success) {
                deletedCount++;
            } else {
                errors.push(
                    `Failed to delete product ${id}: ${result.message}`
                );
            }
        } catch (error) {
            errors.push(`Failed to delete product ${id}: ${error}`);
        }
    }

    // Trigger cache revalidation if any products were deleted
    if (deletedCount > 0) {
        try {
            await revalidateProducts();
        } catch (error) {
            console.warn("Failed to revalidate products cache:", error);
        }
    }

    return {
        success: errors.length === 0,
        deletedCount,
        errors,
    };
};

/**
 * Export products data (Client-side function)
 */
export const exportProducts = async (
    filters?: ProductFilters,
    format: "json" | "csv" = "json",
    token?: string
): Promise<{ success: boolean; data?: any; downloadUrl?: string }> => {
    const searchParams = new URLSearchParams();

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) =>
                        searchParams.append(key, item.toString())
                    );
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });
    }

    searchParams.append("format", format);
    searchParams.append("export", "true");

    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(
        `${API_BASE_URL}/products/export?${searchParams.toString()}`,
        {
            method: "GET",
            headers,
            cache: "no-store",
        }
    );

    if (format === "json") {
        return await response.json();
    } else {
        // For CSV, create a download link
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        return {
            success: true,
            downloadUrl,
        };
    }
};

/**
 * Import products from file (Client-side function)
 */
export const importProducts = async (
    file: File,
    options?: {
        skipDuplicates?: boolean;
        updateExisting?: boolean;
    },
    token?: string
): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
}> => {
    const formData = new FormData();
    formData.append("file", file);

    if (options) {
        Object.entries(options).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });
    }

    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/import`, {
        method: "POST",
        headers,
        body: formData,
        cache: "no-store",
    });

    const result = await response.json();

    // Trigger cache revalidation if any products were imported
    if (result.success && result.imported > 0) {
        try {
            await revalidateProducts();
        } catch (error) {
            console.warn("Failed to revalidate products cache:", error);
        }
    }

    return result;
};

/**
 * Duplicate a product (Client-side function)
 */
export const duplicateProduct = async (
    productId: string,
    modifications?: Partial<CreateProductData>,
    token?: string
): Promise<SingleProductResponse> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const body: any = {};
    if (modifications) {
        body.modifications = modifications;
    }

    const response = await fetch(
        `${API_BASE_URL}/products/${productId}/duplicate`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            cache: "no-store",
        }
    );

    const result = await response.json();

    // Trigger cache revalidation
    if (result.success) {
        try {
            await revalidateProducts();
        } catch (error) {
            console.warn("Failed to revalidate products cache:", error);
        }
    }

    return result;
};

/**
 * Search products with advanced filters (Client-side function)
 */
export const searchProducts = async (
    searchQuery: string,
    filters?: Omit<ProductFilters, "searchTerm">,
    token?: string
): Promise<ProductResponse> => {
    const searchParams = new URLSearchParams();
    searchParams.append("searchTerm", searchQuery);

    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) =>
                        searchParams.append(key, item.toString())
                    );
                } else {
                    searchParams.append(key, value.toString());
                }
            }
        });
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(
        `${API_BASE_URL}/products/search?${searchParams.toString()}`,
        {
            method: "GET",
            headers,
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Get product analytics/statistics (Client-side function)
 */
export const getProductAnalytics = async (
    productId?: string,
    dateRange?: {
        startDate: string;
        endDate: string;
    },
    token?: string
): Promise<{
    success: boolean;
    data: {
        totalProducts: number;
        publishedProducts: number;
        draftProducts: number;
        outOfStockProducts: number;
        totalValue: number;
        averagePrice: number;
        topCategories: Array<{ name: string; count: number }>;
        recentActivity: Array<any>;
    };
}> => {
    const searchParams = new URLSearchParams();

    if (productId) {
        searchParams.append("productId", productId);
    }

    if (dateRange) {
        searchParams.append("startDate", dateRange.startDate);
        searchParams.append("endDate", dateRange.endDate);
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(
        `${API_BASE_URL}/products/analytics?${searchParams.toString()}`,
        {
            method: "GET",
            headers,
            cache: "no-store",
        }
    );

    return await response.json();
};
