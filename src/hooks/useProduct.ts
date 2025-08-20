"use client";

import { useState, useCallback } from "react";
import {
    CreateProductData,
    UpdateProductData,
    ProductFilters,
    Product,
    ProductVariant,
    ProductReview,
    Tag,
} from "@/types/product.types";
import {
    getAllProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
} from "@/service/actions/product";
import {
    createProductService,
    updateProductService,
    bulkUpdateProducts,
    bulkDeleteProducts,
} from "@/service/product.service";
import { toast } from "sonner";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (filters?: ProductFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllProducts(filters);

            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message);
                toast.error(response.message);
            }
        } catch (err) {
            const errorMessage = "Failed to fetch products";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createNewProduct = useCallback(async (data: CreateProductData) => {
        try {
            setLoading(true);
            const response = await createProductService(data);

            if (response.success) {
                setProducts((prev) => [response.data, ...prev]);
                toast.success("Product created successfully!");
                return response.data;
            } else {
                toast.error(response.message);
                throw new Error(response.message);
            }
        } catch (err) {
            toast.error("Failed to create product");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExistingProduct = useCallback(
        async (id: string, data: Partial<UpdateProductData>) => {
            try {
                setLoading(true);
                const response = await updateProductService(id, data);

                if (response.success) {
                    setProducts((prev) =>
                        prev.map((product) =>
                            product.id === id ? response.data : product
                        )
                    );
                    toast.success("Product updated successfully!");
                    return response.data;
                } else {
                    toast.error(response.message);
                    throw new Error(response.message);
                }
            } catch (err) {
                toast.error("Failed to update product");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteExistingProduct = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await deleteProduct(id);

            if (response.success) {
                setProducts((prev) =>
                    prev.filter((product) => product.id !== id)
                );
                toast.success("Product deleted successfully!");
            } else {
                toast.error(response.message);
                throw new Error(response.message);
            }
        } catch (err) {
            toast.error("Failed to delete product");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkUpdateExistingProducts = useCallback(
        async (
            updates: Array<{ id: string; data: Partial<UpdateProductData> }>
        ) => {
            try {
                setLoading(true);
                const response = await bulkUpdateProducts(updates);

                if (response.success) {
                    // Update products in state
                    setProducts((prev) =>
                        prev.map((product) => {
                            const update = response.results.find(
                                (r) => r.data.id === product.id
                            );
                            return update && update.success
                                ? update.data
                                : product;
                        })
                    );
                    toast.success("Products updated successfully!");
                } else {
                    toast.error("Some products failed to update");
                }

                return response;
            } catch (err) {
                toast.error("Failed to update products");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const bulkDeleteExistingProducts = useCallback(
        async (productIds: string[]) => {
            try {
                setLoading(true);
                const response = await bulkDeleteProducts(productIds);

                if (response.success) {
                    setProducts((prev) =>
                        prev.filter(
                            (product) => !productIds.includes(product.id)
                        )
                    );
                    toast.success(
                        `${response.deletedCount} products deleted successfully!`
                    );
                } else {
                    toast.error(
                        `Only ${response.deletedCount} out of ${productIds.length} products deleted`
                    );
                }

                return response;
            } catch (err) {
                toast.error("Failed to delete products");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        products,
        loading,
        error,
        fetchProducts,
        createNewProduct,
        updateExistingProduct,
        deleteExistingProduct,
        bulkUpdateExistingProducts,
        bulkDeleteExistingProducts,
    };
};

export const useProduct = (id?: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = useCallback(async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProductById(productId);

            if (response.success) {
                setProduct(response.data);
            } else {
                setError(response.message);
                toast.error(response.message);
            }
        } catch (err) {
            const errorMessage = "Failed to fetch product";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProductBySlug = useCallback(async (slug: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProductBySlug(slug);

            if (response.success) {
                setProduct(response.data);
            } else {
                setError(response.message);
                toast.error(response.message);
            }
        } catch (err) {
            const errorMessage = "Failed to fetch product";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        product,
        loading,
        error,
        fetchProduct,
        fetchProductBySlug,
    };
};

export const useTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = useCallback(
        async (options?: {
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
        }) => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllTags(options);

                if (response.success) {
                    setTags(response.data);
                } else {
                    const errorMessage = "Failed to fetch tags";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } catch (err) {
                const errorMessage = "Failed to fetch tags";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createNewTag = useCallback(
        async (data: {
            name: string;
            slug?: string;
            description?: string;
            color?: string;
        }) => {
            try {
                setLoading(true);
                const response = await createTag(data);

                if (response.success) {
                    setTags((prev) => [response.data, ...prev]);
                    toast.success("Tag created successfully!");
                    return response.data;
                } else {
                    const errorMessage = "Failed to create tag";
                    toast.error(errorMessage);
                    throw new Error(errorMessage);
                }
            } catch (err) {
                toast.error("Failed to create tag");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateExistingTag = useCallback(
        async (
            id: string,
            data: {
                name?: string;
                slug?: string;
                description?: string;
                color?: string;
            }
        ) => {
            try {
                setLoading(true);
                const response = await updateTag(id, data);

                if (response.success) {
                    setTags((prev) =>
                        prev.map((tag) => (tag.id === id ? response.data : tag))
                    );
                    toast.success("Tag updated successfully!");
                    return response.data;
                } else {
                    const errorMessage = "Failed to update tag";
                    toast.error(errorMessage);
                    throw new Error(errorMessage);
                }
            } catch (err) {
                toast.error("Failed to update tag");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteExistingTag = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await deleteTag(id);

            if (response.success) {
                setTags((prev) => prev.filter((tag) => tag.id !== id));
                toast.success("Tag deleted successfully!");
            } else {
                toast.error(response.message);
                throw new Error(response.message);
            }
        } catch (err) {
            toast.error("Failed to delete tag");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        tags,
        loading,
        error,
        fetchTags,
        createNewTag,
        updateExistingTag,
        deleteExistingTag,
    };
};
