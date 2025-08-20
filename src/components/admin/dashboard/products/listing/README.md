# Products Listing Components

This directory contains modular components for the Products listing page, providing a clean separation of concerns and reusable functionality.

## Components Overview

### Core Components

#### `ProductTable.tsx`

-   **Purpose**: Renders the main products table with all product data
-   **Features**:
    -   Product selection (individual and bulk)
    -   Loading and empty states
    -   Product actions (edit, delete)
    -   Responsive product display with images, status badges, and ratings
-   **Props**: Products array, selection handlers, loading state, error handling

#### `ProductListHeader.tsx`

-   **Purpose**: Manages the header section of the products list
-   **Features**:
    -   Search functionality
    -   Filter controls
    -   Loading indicators
    -   Retry functionality for error states
-   **Props**: Search term, filters, filter groups, handlers

#### `ProductsPageHeader.tsx`

-   **Purpose**: Renders the main page header with title and actions
-   **Features**:
    -   Export functionality for selected products
    -   "Add Product" button
-   **Props**: Products data, selected products

### Custom Hooks

#### `useProductData.ts`

-   **Purpose**: Manages product and category data fetching and state
-   **Features**:
    -   Fetches products and categories from API
    -   Handles loading and error states
    -   Provides CRUD operations (update, delete)
    -   Automatic data refresh
-   **Returns**: Products, categories, loading state, error state, handlers

#### `useProductFilters.ts`

-   **Purpose**: Handles all filtering logic and dynamic filter generation
-   **Features**:
    -   Generates dynamic filter options based on actual data
    -   Handles search, category, status, brand, price, stock, rating, and date filters
    -   Memoized filtering for performance
-   **Returns**: Filter groups, filtered products function

## Usage

```tsx
import {
    ProductTable,
    ProductListHeader,
    ProductsPageHeader,
    useProductFilters,
    useProductData,
} from "@/components/admin/dashboard/products/listing";

export default function ProductsPage() {
    // Use hooks for data and filtering
    const { products, categories, loading, error, ... } = useProductData();
    const { filterGroups, getFilteredProducts } = useProductFilters(products, categories);

    // Component logic...

    return (
        <div>
            <ProductsPageHeader products={products} selectedProducts={selectedProducts} />
            <Card>
                <ProductListHeader
                    // props...
                />
                <CardContent>
                    <ProductTable
                        // props...
                    />
                </CardContent>
            </Card>
        </div>
    );
}
```

## Benefits of Modular Architecture

### 1. **Separation of Concerns**

-   Each component has a single responsibility
-   Data logic separated from UI logic
-   Filtering logic isolated in custom hooks

### 2. **Reusability**

-   Components can be reused in other parts of the application
-   Custom hooks can be shared across different product-related pages
-   Easy to create variants (e.g., simplified product picker)

### 3. **Maintainability**

-   Easier to test individual components
-   Changes to one feature don't affect others
-   Clear component boundaries make debugging easier

### 4. **Performance**

-   Memoized filtering reduces unnecessary re-renders
-   Components only re-render when their specific props change
-   Efficient data fetching with proper error handling

### 5. **Developer Experience**

-   Clear prop interfaces with TypeScript
-   Consistent patterns across components
-   Easy to onboard new developers

## Testing Strategy

Each component can be tested independently:

```typescript
// Example test structure
describe("ProductTable", () => {
    it("renders products correctly");
    it("handles selection");
    it("shows loading state");
    it("handles empty state");
});

describe("useProductFilters", () => {
    it("filters by search term");
    it("filters by category");
    it("generates dynamic filter options");
});
```

## Future Enhancements

1. **Virtualization**: Add virtual scrolling for large product lists
2. **Advanced Filters**: More sophisticated filtering UI
3. **Bulk Operations**: Extended bulk action capabilities
4. **Export Options**: More export formats and customization
5. **Real-time Updates**: WebSocket integration for real-time product updates

## File Structure

```
src/components/admin/dashboard/products/listing/
├── index.ts                 # Export barrel
├── ProductTable.tsx         # Main table component
├── ProductListHeader.tsx    # Header with search and filters
├── ProductsPageHeader.tsx   # Page title and actions
├── useProductData.ts        # Data fetching hook
├── useProductFilters.ts     # Filtering logic hook
└── README.md               # This file
```
