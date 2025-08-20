import { useMemo } from "react";
import { Product, TCategory } from "@/types/product.types";

// Helper function to get brand name (from attributes or placeholder)
const getBrandName = (product: Product) => {
    return (
        product.attributes?.brand ||
        product.attributes?.manufacturer ||
        "No Brand"
    );
};

// Helper function to get status display text
const getProductStatus = (product: Product) => {
    const stock = Number(product.stock) || 0;
    const minStock = Number(product.minStock) || 0;

    if (stock === 0) {
        return "Out of Stock";
    } else if (stock <= minStock) {
        return "Low Stock";
    } else if (product.isActive) {
        return "Active";
    } else {
        return "Inactive";
    }
};

// Helper function to get average rating
const getAverageRating = (product: Product): number => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
};

export function useProductFilters(
    products: Product[],
    categories: TCategory[]
) {
    // Dynamic filter groups based on loaded data
    const filterGroups = useMemo(() => {
        // Get unique brands from products
        const brands = Array.from(
            new Set(
                products
                    .map(getBrandName)
                    .filter((brand) => brand && brand !== "No Brand")
            )
        ).sort();

        // Get price range from products
        const prices = products
            .map((p) => Number(p.price))
            .filter((p) => p > 0 && !isNaN(p));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

        // Get stock range from products
        const stocks = products
            .map((p) => Number(p.stock))
            .filter((s) => s >= 0 && !isNaN(s));
        const minStock = stocks.length > 0 ? Math.min(...stocks) : 0;
        const maxStock = stocks.length > 0 ? Math.max(...stocks) : 100;

        return [
            {
                id: "category",
                label: "Category",
                type: "checkbox" as const,
                options: categories.map((cat) => ({
                    id: cat.id || cat.name.toLowerCase().replace(/\s+/g, "-"),
                    label: cat.name,
                    value: cat.name,
                })),
            },
            {
                id: "status",
                label: "Status",
                type: "checkbox" as const,
                options: [
                    { id: "active", label: "Active", value: "Active" },
                    { id: "low-stock", label: "Low Stock", value: "Low Stock" },
                    {
                        id: "out-of-stock",
                        label: "Out of Stock",
                        value: "Out of Stock",
                    },
                    { id: "inactive", label: "Inactive", value: "Inactive" },
                ],
            },
            {
                id: "brand",
                label: "Brand",
                type: "checkbox" as const,
                options: brands.map((brand) => ({
                    id: brand.toLowerCase().replace(/\s+/g, "-"),
                    label: brand,
                    value: brand,
                })),
            },
            {
                id: "price",
                label: "Price Range",
                type: "range" as const,
                min: Math.floor(minPrice),
                max: Math.ceil(maxPrice),
            },
            {
                id: "stock",
                label: "Stock Range",
                type: "range" as const,
                min: minStock,
                max: maxStock,
            },
            {
                id: "rating",
                label: "Rating",
                type: "radio" as const,
                options: [
                    { id: "4plus", label: "4+ Stars", value: "4+" },
                    { id: "3plus", label: "3+ Stars", value: "3+" },
                    { id: "2plus", label: "2+ Stars", value: "2+" },
                    { id: "1plus", label: "1+ Stars", value: "1+" },
                ],
            },
            {
                id: "dateCreated",
                label: "Date Created",
                type: "date" as const,
            },
        ];
    }, [products, categories]);

    // Filter products based on search term and filters
    const getFilteredProducts = useMemo(() => {
        return (searchTerm: string, filters: Record<string, any>) => {
            return products.filter((product: Product) => {
                // Search filter
                if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesName = product.name
                        .toLowerCase()
                        .includes(searchLower);
                    const matchesCategory = product.category?.name
                        ?.toLowerCase()
                        .includes(searchLower);
                    const matchesBrand = getBrandName(product)
                        .toLowerCase()
                        .includes(searchLower);
                    const matchesSku = product.sku
                        ?.toLowerCase()
                        .includes(searchLower);

                    if (
                        !matchesName &&
                        !matchesCategory &&
                        !matchesBrand &&
                        !matchesSku
                    ) {
                        return false;
                    }
                }

                // Category filter
                if (filters.category?.length > 0) {
                    const categoryName = product.category?.name;
                    if (
                        !categoryName ||
                        !filters.category.includes(categoryName)
                    ) {
                        return false;
                    }
                }

                // Status filter
                if (filters.status?.length > 0) {
                    const productStatus = getProductStatus(product);
                    if (!filters.status.includes(productStatus)) {
                        return false;
                    }
                }

                // Brand filter
                if (filters.brand?.length > 0) {
                    const brandName = getBrandName(product);
                    if (!filters.brand.includes(brandName)) {
                        return false;
                    }
                }

                // Price range filter
                if (
                    filters.price?.min &&
                    Number(product.price) < Number.parseFloat(filters.price.min)
                ) {
                    return false;
                }
                if (
                    filters.price?.max &&
                    Number(product.price) > Number.parseFloat(filters.price.max)
                ) {
                    return false;
                }

                // Stock range filter
                if (
                    filters.stock?.min &&
                    Number(product.stock) < Number.parseInt(filters.stock.min)
                ) {
                    return false;
                }
                if (
                    filters.stock?.max &&
                    Number(product.stock) > Number.parseInt(filters.stock.max)
                ) {
                    return false;
                }

                // Rating filter
                if (filters.rating) {
                    const minRating = Number.parseFloat(
                        filters.rating.replace("+", "")
                    );
                    const avgRating = getAverageRating(product);
                    if (avgRating < minRating) {
                        return false;
                    }
                }

                // Date filter
                if (
                    filters.dateCreated?.from &&
                    new Date(product.createdAt) <
                        new Date(filters.dateCreated.from)
                ) {
                    return false;
                }
                if (
                    filters.dateCreated?.to &&
                    new Date(product.createdAt) >
                        new Date(filters.dateCreated.to)
                ) {
                    return false;
                }

                return true;
            });
        };
    }, [products]);

    return {
        filterGroups,
        getFilteredProducts,
    };
}
