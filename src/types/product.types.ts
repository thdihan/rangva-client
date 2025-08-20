export type TCategory = {
    id?: string;
    name: string;
    description?: string;
    image: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK";

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;

    // Pricing
    price: number;
    salePrice?: number;
    costPrice?: number;

    // Inventory
    sku?: string;
    stock: number;
    minStock: number;
    maxStock?: number;
    trackStock: boolean;

    // Physical attributes
    weight?: number;
    dimensions?: string; // JSON string

    // Product status
    status: ProductStatus;
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;

    // Media
    images: string[];
    thumbnail?: string;
    gallery: string[];

    // Category relation
    categoryId: string;
    category?: TCategory;

    // Additional attributes
    attributes?: Record<string, any>;
    specifications?: Record<string, any>;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;

    // Relations
    productVariants?: ProductVariant[];
    reviews?: ProductReview[];
    tags?: ProductTag[];
}

export interface ProductVariant {
    id: string;
    productId: string;
    product?: Product;

    // Variant details
    name: string;
    sku?: string;
    price: number;
    salePrice?: number;
    stock: number;
    isActive: boolean;

    // Variant attributes
    attributes: Record<string, any>;

    // Media
    image?: string;

    createdAt: string;
    updatedAt: string;
}

export interface ProductReview {
    id: string;
    productId: string;
    product?: Product;

    // Review details
    rating: number; // 1-5 stars
    title?: string;
    comment: string;

    // Reviewer info
    reviewerName: string;
    reviewerEmail: string;

    // Status
    isApproved: boolean;
    isVerified: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;

    createdAt: string;
    updatedAt: string;

    products?: ProductTag[];
}

export interface ProductTag {
    id: string;
    productId: string;
    tagId: string;

    product?: Product;
    tag?: Tag;

    createdAt: string;
}

// API Response Types
export interface ProductResponse {
    success: boolean;
    status: number;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: Product[];
}

export interface SingleProductResponse {
    success: boolean;
    status: number;
    message: string;
    data: Product;
}

// Form Types
export interface CreateProductData {
    name: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    sku?: string;
    stock: number;
    minStock?: number;
    maxStock?: number;
    trackStock?: boolean;
    weight?: number;
    dimensions?: string;
    status: ProductStatus;
    isActive?: boolean;
    isFeatured?: boolean;
    isDigital?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    images?: string[];
    thumbnail?: string;
    gallery?: string[];
    categoryId: string;
    attributes?: Record<string, any>;
    specifications?: Record<string, any>;
    tags?: string[]; // Array of tag IDs
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id: string;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    searchTerm?: string;
    categoryId?: string;
    status?: ProductStatus;
    isActive?: boolean;
    isFeatured?: boolean;
    isDigital?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    tags?: string[];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
export type TCategoryResponse = TCategory[];
