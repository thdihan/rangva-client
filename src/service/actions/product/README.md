# Product Management API Documentation

This document describes the complete product management system including server actions, client services, and custom hooks.

## Overview

The product management system includes:

-   **Server Actions**: For server-side operations with caching
-   **Client Services**: For client-side operations and complex data handling
-   **Custom Hooks**: For state management and reusable logic
-   **TypeScript Types**: For type safety across the application

## 📁 File Structure

```
src/
├── service/
│   ├── actions/
│   │   └── product/
│   │       └── index.ts          # Server Actions
│   └── product.service.ts         # Client Service
├── hooks/
│   └── useProduct.ts             # Custom Hooks
├── types/
│   └── product.types.ts          # TypeScript Types
└── app/admin/(dashboardLayout)/products/
    ├── page.tsx                  # Products List Page
    └── add/
        └── page.tsx              # Add Product Page
```

## 🔧 Server Actions (`/service/actions/product/index.ts`)

Server actions run on the server and support caching with Next.js.

### Product Operations

#### `getAllProducts(filters?: ProductFilters)`

Get all products with filtering and pagination.

```typescript
import { getAllProducts } from "@/service/actions/product";

const products = await getAllProducts({
    page: 1,
    limit: 10,
    searchTerm: "laptop",
    categoryId: "category-id",
    status: "PUBLISHED",
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
});
```

#### `getProductById(id: string)`

Get a single product by ID.

```typescript
const product = await getProductById("product-id");
```

#### `getProductBySlug(slug: string)`

Get a single product by slug.

```typescript
const product = await getProductBySlug("product-slug");
```

#### `createProduct(data: CreateProductData, token?: string)`

Create a new product.

```typescript
const result = await createProduct({
    name: "New Product",
    price: 99.99,
    categoryId: "category-id",
    // ... other fields
});
```

#### `updateProduct(id: string, data: Partial<UpdateProductData>, token?: string)`

Update an existing product.

```typescript
const result = await updateProduct("product-id", {
    name: "Updated Name",
    price: 149.99,
});
```

#### `deleteProduct(id: string, token?: string)`

Delete a product.

```typescript
const result = await deleteProduct("product-id");
```

### Product Variant Operations

#### `getProductVariants(productId: string)`

Get all variants for a product.

```typescript
const variants = await getProductVariants("product-id");
```

#### `createProductVariant(data, token?: string)`

Create a new product variant.

```typescript
const variant = await createProductVariant({
    productId: "product-id",
    name: "Large Size",
    price: 120.0,
    attributes: { size: "L", color: "Red" },
});
```

### Review Operations

#### `getProductReviews(productId: string, options?)`

Get reviews for a product.

```typescript
const reviews = await getProductReviews("product-id", {
    page: 1,
    limit: 10,
});
```

#### `createProductReview(data, token?: string)`

Create a new review.

```typescript
const review = await createProductReview({
    productId: "product-id",
    rating: 5,
    comment: "Great product!",
    reviewerName: "John Doe",
    reviewerEmail: "john@example.com",
});
```

### Tag Operations

#### `getAllTags(options?)`

Get all tags.

```typescript
const tags = await getAllTags({
    page: 1,
    limit: 50,
});
```

#### `createTag(data, token?: string)`

Create a new tag.

```typescript
const tag = await createTag({
    name: "Electronics",
    description: "Electronic devices",
    color: "#3B82F6",
});
```

## 🔧 Client Service (`/service/product.service.ts`)

Client services run on the client-side and handle complex operations.

### Advanced Operations

#### `createProductService(data: CreateProductData, token?: string)`

Create a product with enhanced client-side handling.

```typescript
import { createProductService } from "@/service/product.service";

const result = await createProductService({
    name: "New Product",
    price: 99.99,
    // ... full product data
});
```

#### `bulkUpdateProducts(updates, token?: string)`

Update multiple products at once.

```typescript
const result = await bulkUpdateProducts([
    { id: "product-1", data: { price: 99.99 } },
    { id: "product-2", data: { price: 149.99 } },
]);
```

#### `bulkDeleteProducts(productIds: string[], token?: string)`

Delete multiple products.

```typescript
const result = await bulkDeleteProducts(["product-1", "product-2"]);
```

#### `exportProducts(filters?, format?, token?)`

Export products data.

```typescript
// Export as JSON
const result = await exportProducts(filters, "json");

// Export as CSV
const result = await exportProducts(filters, "csv");
if (result.downloadUrl) {
    // Create download link
    const link = document.createElement("a");
    link.href = result.downloadUrl;
    link.download = "products.csv";
    link.click();
}
```

#### `importProducts(file: File, options?, token?)`

Import products from file.

```typescript
const fileInput = document.getElementById("file-input") as HTMLInputElement;
const file = fileInput.files[0];

const result = await importProducts(file, {
    skipDuplicates: true,
    updateExisting: false,
});
```

#### `duplicateProduct(productId: string, modifications?, token?)`

Duplicate an existing product.

```typescript
const duplicate = await duplicateProduct("product-id", {
    name: "Product Copy",
    sku: "new-sku",
});
```

## 🎣 Custom Hooks (`/hooks/useProduct.ts`)

Custom hooks provide state management and reusable logic.

### `useProducts()`

Manage multiple products.

```typescript
import { useProducts } from "@/hooks/useProduct";

function ProductsList() {
    const {
        products,
        loading,
        error,
        fetchProducts,
        createNewProduct,
        updateExistingProduct,
        deleteExistingProduct,
        bulkUpdateExistingProducts,
        bulkDeleteExistingProducts,
    } = useProducts();

    useEffect(() => {
        fetchProducts({ page: 1, limit: 10 });
    }, [fetchProducts]);

    const handleCreate = async (data: CreateProductData) => {
        try {
            const newProduct = await createNewProduct(data);
            console.log("Created:", newProduct);
        } catch (error) {
            console.error("Failed to create:", error);
        }
    };

    // Component JSX...
}
```

### `useProduct(id?: string)`

Manage a single product.

```typescript
import { useProduct } from "@/hooks/useProduct";

function ProductDetail({ productId }: { productId: string }) {
    const { product, loading, error, fetchProduct, fetchProductBySlug } =
        useProduct();

    useEffect(() => {
        fetchProduct(productId);
    }, [fetchProduct, productId]);

    // Component JSX...
}
```

### `useTags()`

Manage tags.

```typescript
import { useTags } from "@/hooks/useProduct";

function TagManager() {
    const {
        tags,
        loading,
        error,
        fetchTags,
        createNewTag,
        updateExistingTag,
        deleteExistingTag,
    } = useTags();

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    // Component JSX...
}
```

## 🎯 Integration Examples

### Complete Add Product Form

```typescript
import { useState } from "react";
import { useProducts } from "@/hooks/useProduct";
import { CreateProductData } from "@/types/product.types";
import { toast } from "sonner";

function AddProductForm() {
    const { createNewProduct } = useProducts();
    const [formData, setFormData] = useState<CreateProductData>({
        name: "",
        price: 0,
        categoryId: "",
        // ... other required fields
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const product = await createNewProduct(formData);
            toast.success("Product created successfully!");
            // Redirect or reset form
        } catch (error) {
            toast.error("Failed to create product");
        }
    };

    return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### Products List with Filtering

```typescript
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProduct";
import { ProductFilters } from "@/types/product.types";

function ProductsList() {
    const { products, loading, fetchProducts } = useProducts();
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 10,
    });

    useEffect(() => {
        fetchProducts(filters);
    }, [fetchProducts, filters]);

    const handleSearch = (searchTerm: string) => {
        setFilters((prev) => ({
            ...prev,
            searchTerm,
            page: 1,
        }));
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => handleSearch(e.target.value)}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                products.map((product) => (
                    <div key={product.id}>
                        {product.name} - ${product.price}
                    </div>
                ))
            )}
        </div>
    );
}
```

### Bulk Operations

```typescript
import { useState } from "react";
import { useProducts } from "@/hooks/useProduct";

function BulkOperations() {
    const { products, bulkDeleteExistingProducts } = useProducts();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        const confirmed = confirm(`Delete ${selectedIds.length} products?`);
        if (confirmed) {
            try {
                await bulkDeleteExistingProducts(selectedIds);
                setSelectedIds([]);
            } catch (error) {
                console.error("Bulk delete failed:", error);
            }
        }
    };

    return (
        <div>
            {products.map((product) => (
                <div key={product.id}>
                    <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, product.id]);
                            } else {
                                setSelectedIds((prev) =>
                                    prev.filter((id) => id !== product.id)
                                );
                            }
                        }}
                    />
                    {product.name}
                </div>
            ))}
            <button onClick={handleBulkDelete}>
                Delete Selected ({selectedIds.length})
            </button>
        </div>
    );
}
```

## 🔐 Authentication

Most operations support optional authentication tokens:

```typescript
// Get token from your auth system
const token = "Bearer your-jwt-token";

// Use with server actions
const result = await createProduct(data, token);

// Use with client services
const result = await createProductService(data, token);
```

## 🎨 Caching

Server actions automatically handle caching:

```typescript
// These operations automatically revalidate relevant cache tags
await createProduct(data); // Revalidates "products"
await updateProduct(id, data); // Revalidates "products" and "product-{id}"
await deleteProduct(id); // Revalidates "products" and "product-{id}"

// Manual cache revalidation
import { revalidateProducts, revalidateTags } from "@/service/actions/product";
await revalidateProducts();
await revalidateTags();
```

## 🔄 Error Handling

All functions include built-in error handling with toast notifications:

```typescript
try {
    const result = await createNewProduct(data);
    // Success handling is automatic (toast notification)
    return result;
} catch (error) {
    // Error handling is automatic (toast notification)
    // Additional custom error handling if needed
    console.error("Additional logging:", error);
}
```

## 📊 Type Safety

All operations are fully typed with TypeScript:

```typescript
import type {
    Product,
    CreateProductData,
    UpdateProductData,
    ProductFilters,
    ProductResponse,
    SingleProductResponse,
} from "@/types/product.types";

// Type-safe function calls
const products: ProductResponse = await getAllProducts();
const product: SingleProductResponse = await getProductById("id");
```

## 🚀 Getting Started

1. **Import the hooks or services you need:**

    ```typescript
    import { useProducts, useTags } from "@/hooks/useProduct";
    import { createProductService } from "@/service/product.service";
    import { getAllProducts } from "@/service/actions/product";
    ```

2. **Use in your components:**

    ```typescript
    const { products, loading, fetchProducts } = useProducts();
    ```

3. **Handle operations:**

    ```typescript
    const handleCreate = async (data: CreateProductData) => {
        await createNewProduct(data);
    };
    ```

4. **Enjoy full type safety and automatic caching!**

## 📱 Examples in Production

See the implementation examples in:

-   `/app/admin/(dashboardLayout)/products/add/page.tsx` - Complete product creation form
-   `/app/admin/(dashboardLayout)/products/page.tsx` - Products list with filtering
-   Components using `ImageSelector` for product images

This system provides a complete, type-safe, and performant solution for product management in your e-commerce application.
