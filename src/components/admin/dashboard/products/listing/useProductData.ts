import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "@/service/actions/product";
import { getAllCategories } from "@/service/actions/category";
import { getAccessKey } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";
import { Product, TCategory } from "@/types/product.types";

export function useProductData() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string[]>([]); // Track products being deleted

    // Load products and categories from database
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productsResponse, categoriesResponse] = await Promise.all([
                getAllProducts(),
                getAllCategories(),
            ]);

            if (productsResponse.success && productsResponse.data) {
                setProducts(productsResponse.data);
            } else {
                setError(productsResponse.message || "Failed to load products");
                setProducts([]);
            }

            if (categoriesResponse.success && categoriesResponse.data) {
                setCategories(categoriesResponse.data);
            } else {
                console.warn(
                    "Failed to load categories:",
                    categoriesResponse.message
                );
                setCategories([]);
            }
        } catch (err) {
            console.error("Error loading data:", err);
            setError("Failed to load data. Please try again.");
            setProducts([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProductUpdate = (updatedProduct: any) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    const handleProductDelete = async (productId: string, token?: string) => {
        try {
            // Add to delete loading state
            setDeleteLoading((prev) => [...prev, productId]);

            // Get auth token if not provided
            const authToken = token || getAccessKey(adminAccessToken);

            const result = await deleteProduct(productId, authToken);

            if (result.success) {
                // Remove from local state only if deletion was successful
                setProducts((prev) => prev.filter((p) => p.id !== productId));
                return { success: true, message: result.message };
            } else {
                console.error("Failed to delete product:", result.message);
                return {
                    success: false,
                    message: result.message || "Failed to delete product",
                };
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            return {
                success: false,
                message: "An error occurred while deleting the product",
            };
        } finally {
            // Remove from delete loading state
            setDeleteLoading((prev) => prev.filter((id) => id !== productId));
        }
    };

    const handleBulkDelete = async (productIds: string[], token?: string) => {
        try {
            // Add all products to delete loading state
            setDeleteLoading((prev) => [...prev, ...productIds]);

            // Get auth token if not provided
            const authToken = token || getAccessKey(adminAccessToken);

            const deletePromises = productIds.map((id) =>
                deleteProduct(id, authToken)
            );
            const results = await Promise.allSettled(deletePromises);

            const successfulDeletes: string[] = [];
            const failedDeletes: string[] = [];

            results.forEach((result, index) => {
                const productId = productIds[index];
                if (result.status === "fulfilled" && result.value.success) {
                    successfulDeletes.push(productId);
                } else {
                    failedDeletes.push(productId);
                    console.error(
                        `Failed to delete product ${productId}:`,
                        result.status === "fulfilled"
                            ? result.value.message
                            : result.reason
                    );
                }
            });

            // Remove successfully deleted products from local state
            if (successfulDeletes.length > 0) {
                setProducts((prev) =>
                    prev.filter((p) => !successfulDeletes.includes(p.id))
                );
            }

            return {
                success: failedDeletes.length === 0,
                successCount: successfulDeletes.length,
                failedCount: failedDeletes.length,
                message:
                    failedDeletes.length === 0
                        ? `Successfully deleted ${successfulDeletes.length} product(s)`
                        : `${successfulDeletes.length} deleted successfully, ${failedDeletes.length} failed`,
            };
        } catch (error) {
            console.error("Error during bulk delete:", error);
            return {
                success: false,
                successCount: 0,
                failedCount: productIds.length,
                message: "An error occurred during bulk delete",
            };
        } finally {
            // Remove all products from delete loading state
            setDeleteLoading((prev) =>
                prev.filter((id) => !productIds.includes(id))
            );
        }
    };

    return {
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
    };
}
