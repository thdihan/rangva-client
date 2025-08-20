"use server";

import { revalidateTag } from "next/cache";
import {
    ProductResponse,
    SingleProductResponse,
    CreateProductData,
    UpdateProductData,
    ProductFilters,
    ProductVariant,
    ProductReview,
    Tag,
} from "@/types/product.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/**
 * Get all products with pagination and filtering
 */
export const getAllProducts = async (
    filters?: ProductFilters
): Promise<ProductResponse> => {
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

    const response = await fetch(
        `${API_BASE_URL}/products?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: ["products"] },
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Get a single product by ID
 */
export const getProductById = async (
    id: string
): Promise<SingleProductResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        next: { tags: ["products", `product-${id}`] },
        cache: "no-store",
    });

    return await response.json();
};

/**
 * Get a single product by slug
 */
export const getProductBySlug = async (
    slug: string
): Promise<SingleProductResponse> => {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        next: { tags: ["products", `product-slug-${slug}`] },
        cache: "no-store",
    });

    return await response.json();
};

/**
 * Create a new product
 */
export const createProduct = async (
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

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
    }

    return result;
};

/**
 * Update a product
 */
export const updateProduct = async (
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

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
        revalidateTag(`product-${id}`);
    }

    return result;
};

/**
 * Delete a product
 */
export const deleteProduct = async (
    id: string,
    token?: string
): Promise<{ success: boolean; message: string }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
        revalidateTag(`product-${id}`);
    }

    return result;
};

/**
 * Get product variants
 */
export const getProductVariants = async (
    productId: string
): Promise<{ success: boolean; data: ProductVariant[] }> => {
    const response = await fetch(
        `${API_BASE_URL}/products/${productId}/variants`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: ["products", `product-variants-${productId}`] },
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Create a product variant
 */
export const createProductVariant = async (
    data: {
        productId: string;
        name: string;
        sku?: string;
        price: number;
        salePrice?: number;
        stock: number;
        isActive?: boolean;
        attributes: Record<string, any>;
        image?: string;
    },
    token?: string
): Promise<{ success: boolean; data: ProductVariant }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/variants`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
        revalidateTag(`product-variants-${data.productId}`);
    }

    return result;
};

/**
 * Update a product variant
 */
export const updateProductVariant = async (
    id: string,
    data: Partial<{
        name: string;
        sku?: string;
        price: number;
        salePrice?: number;
        stock: number;
        isActive: boolean;
        attributes: Record<string, any>;
        image?: string;
    }>,
    token?: string
): Promise<{ success: boolean; data: ProductVariant }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/variants/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
    }

    return result;
};

/**
 * Delete a product variant
 */
export const deleteProductVariant = async (
    id: string,
    token?: string
): Promise<{ success: boolean; message: string }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/variants/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
    }

    return result;
};

/**
 * Get product reviews
 */
export const getProductReviews = async (
    productId: string,
    options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }
): Promise<{
    success: boolean;
    data: ProductReview[];
    meta?: { total: number; page: number; limit: number; totalPages: number };
}> => {
    const searchParams = new URLSearchParams();

    if (options) {
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, value.toString());
            }
        });
    }

    const response = await fetch(
        `${API_BASE_URL}/products/${productId}/reviews?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: [`product-reviews-${productId}`] },
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Create a product review
 */
export const createProductReview = async (
    data: {
        productId: string;
        rating: number;
        title?: string;
        comment: string;
        reviewerName: string;
        reviewerEmail: string;
    },
    token?: string
): Promise<{ success: boolean; data: ProductReview }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag(`product-reviews-${data.productId}`);
    }

    return result;
};

/**
 * Update review status (approve/disapprove)
 */
export const updateReviewStatus = async (
    id: string,
    isApproved: boolean,
    token?: string
): Promise<{ success: boolean; data: ProductReview }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(
        `${API_BASE_URL}/products/reviews/${id}/status`,
        {
            method: "PATCH",
            headers,
            body: JSON.stringify({ isApproved }),
            cache: "no-store",
        }
    );

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
    }

    return result;
};

/**
 * Delete a product review
 */
export const deleteProductReview = async (
    id: string,
    token?: string
): Promise<{ success: boolean; message: string }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/reviews/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("products");
    }

    return result;
};

/**
 * Get all tags
 */
export const getAllTags = async (options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}): Promise<{
    success: boolean;
    data: Tag[];
    meta?: { total: number; page: number; limit: number; totalPages: number };
}> => {
    const searchParams = new URLSearchParams();

    if (options) {
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, value.toString());
            }
        });
    }

    const response = await fetch(
        `${API_BASE_URL}/products/tags/all?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: ["tags"] },
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Create a tag
 */
export const createTag = async (
    data: {
        name: string;
        slug?: string;
        description?: string;
        color?: string;
    },
    token?: string
): Promise<{ success: boolean; data: Tag }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("tags");
    }

    return result;
};

/**
 * Update a tag
 */
export const updateTag = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        color?: string;
    },
    token?: string
): Promise<{ success: boolean; data: Tag }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/tags/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("tags");
    }

    return result;
};

/**
 * Delete a tag
 */
export const deleteTag = async (
    id: string,
    token?: string
): Promise<{ success: boolean; message: string }> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/products/tags/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
    });

    const result = await response.json();

    // Revalidate cache if successful
    if (result.success) {
        revalidateTag("tags");
    }

    return result;
};

/**
 * Revalidate products cache
 */
export const revalidateProducts = async () => {
    revalidateTag("products");
};

/**
 * Revalidate tags cache
 */
export const revalidateTags = async () => {
    revalidateTag("tags");
};
