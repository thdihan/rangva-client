# Product Components

This directory contains modular, reusable components for product management in the admin dashboard. These components have been extracted from the original Add Product page to improve maintainability, reusability, and testing.

## Component Overview

### Core Components

#### 1. **ProductBasicInfo**

-   **Purpose**: Handles basic product information input
-   **Props**: `formData`, `onInputChange`, `onNameChange`, `generateSlug`
-   **Features**:
    -   Product name with automatic slug generation
    -   Short and full descriptions
    -   **Dynamic category selection** - Loads categories from database
    -   SKU input
-   **API Integration**:
    -   Fetches categories using `getAllCategories()` service
    -   Loading states and error handling
    -   Retry mechanism for failed category loads
    -   Filters only active categories
    -   Shows category descriptions as hints

#### 2. **ProductPricing**

-   **Purpose**: Manages pricing and inventory settings
-   **Props**: `formData`, `onInputChange`
-   **Features**:
    -   Regular price, sale price, cost price
    -   Stock quantity management
    -   Min/max stock levels
    -   Stock tracking toggle

#### 3. **ProductPhysicalAttributes**

-   **Purpose**: Handles physical product properties
-   **Props**: `formData`, `onInputChange`
-   **Features**:
    -   Weight input
    -   Dimensions
    -   Digital product flag

#### 4. **ProductCustomAttributes**

-   **Purpose**: Dynamic custom attribute management
-   **Props**: `customAttributes`, `onAddAttribute`, `onUpdateAttribute`, `onRemoveAttribute`
-   **Features**:
    -   Add/remove custom key-value pairs
    -   Dynamic attribute creation
    -   Form validation ready

#### 5. **ProductSpecifications**

-   **Purpose**: Technical specifications management
-   **Props**: `customSpecs`, `onAddSpec`, `onUpdateSpec`, `onRemoveSpec`
-   **Features**:
    -   Technical specification key-value pairs
    -   Dynamic spec management
    -   Structured data handling

#### 6. **ProductSEO**

-   **Purpose**: SEO and meta information
-   **Props**: `formData`, `onInputChange`
-   **Features**:
    -   Meta title, description, keywords
    -   SEO optimization fields
    -   Search engine friendly

#### 7. **ProductImages**

-   **Purpose**: Image and gallery management
-   **Props**: `selectedImages`, `thumbnailImage`, `onImageSelection`, `onThumbnailSelection`, `onRemoveImage`, `onSetAsThumbnail`, `onRemoveThumbnail`
-   **Features**:
    -   Multiple image selection
    -   Thumbnail management
    -   Image preview and ordering
    -   Gallery integration

#### 8. **ProductStatus**

-   **Purpose**: Product status and visibility controls
-   **Props**: `formData`, `onInputChange`
-   **Features**:
    -   Publication status
    -   Active/inactive toggle
    -   Featured product flag

#### 9. **ProductTags**

-   **Purpose**: Tag management system
-   **Props**: `selectedTags`, `newTag`, `onNewTagChange`, `onAddTag`, `onRemoveTag`
-   **Features**:
    -   Dynamic tag creation
    -   Tag removal
    -   Visual tag display

#### 10. **ProductActions**

-   **Purpose**: Form submission and actions
-   **Props**: `onSave`, `onSaveAsDraft`, `isLoading`
-   **Features**:
    -   Save and draft functionality
    -   Loading state management
    -   Action button styling

## Usage Example

```tsx
import {
    ProductBasicInfo,
    ProductPricing,
    ProductPhysicalAttributes,
    ProductCustomAttributes,
    ProductSpecifications,
    ProductSEO,
    ProductImages,
    ProductStatus,
    ProductTags,
    ProductActions,
} from "@/components/admin/dashboard/products";

function AddProductPage() {
    // State management...

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <ProductBasicInfo
                    formData={formData}
                    onInputChange={handleInputChange}
                    onNameChange={handleNameChange}
                    generateSlug={generateSlug}
                />

                <ProductPricing
                    formData={formData}
                    onInputChange={handleInputChange}
                />

                <ProductPhysicalAttributes
                    formData={formData}
                    onInputChange={handleInputChange}
                />

                <ProductCustomAttributes
                    customAttributes={customAttributes}
                    onAddAttribute={addCustomAttribute}
                    onUpdateAttribute={updateCustomAttribute}
                    onRemoveAttribute={removeCustomAttribute}
                />

                <ProductSpecifications
                    customSpecs={customSpecs}
                    onAddSpec={addCustomSpec}
                    onUpdateSpec={updateCustomSpec}
                    onRemoveSpec={removeCustomSpec}
                />

                <ProductSEO
                    formData={formData}
                    onInputChange={handleInputChange}
                />
            </div>

            <div className="space-y-6">
                <ProductImages
                    selectedImages={selectedImages}
                    thumbnailImage={thumbnailImage}
                    onImageSelection={handleImageSelection}
                    onThumbnailSelection={handleThumbnailSelection}
                    onRemoveImage={removeImage}
                    onSetAsThumbnail={setAsThumbnail}
                    onRemoveThumbnail={removeThumbnail}
                />

                <ProductStatus
                    formData={formData}
                    onInputChange={handleInputChange}
                />

                <ProductTags
                    selectedTags={selectedTags}
                    newTag={newTag}
                    onNewTagChange={setNewTag}
                    onAddTag={addTag}
                    onRemoveTag={removeTag}
                />

                <ProductActions
                    onSave={() => handleSubmit(false)}
                    onSaveAsDraft={() => handleSubmit(true)}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
```

## Architecture Benefits

### 1. **Modularity**

-   Each component handles a specific domain
-   Easy to understand and maintain
-   Reduced cognitive load

### 2. **Reusability**

-   Components can be used in other product-related pages
-   Consistent UI across the application
-   Shared component library

### 3. **Testability**

-   Individual components can be unit tested
-   Isolated functionality testing
-   Mocked props for testing

### 4. **Maintainability**

-   Changes isolated to specific components
-   Clear separation of concerns
-   Easy to debug and update

### 5. **Developer Experience**

-   Clear prop interfaces
-   TypeScript support
-   Predictable component behavior

## Database Integration

### Category Management

The `ProductBasicInfo` component integrates with the backend category service:

-   **Service**: Uses `getAllCategories()` from `@/service/actions/category`
-   **Auto-loading**: Categories are fetched automatically on component mount
-   **Error Handling**: Graceful fallbacks for API failures
-   **User Experience**: Loading indicators and retry mechanisms
-   **Filtering**: Only shows active categories to users

### Prerequisites

-   Backend category API must be running
-   Categories should be created in the database before adding products
-   Proper API base URL configuration in environment variables

## Type Safety

All components are fully typed with TypeScript:

```tsx
interface ProductBasicInfoProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
    onNameChange: (name: string) => void;
    generateSlug: (name: string) => string;
}
```

## Styling

Components use:

-   **Tailwind CSS** for styling
-   **shadcn/ui** component library
-   **Lucide React** for icons
-   Consistent design system

## Future Enhancements

### Planned Features

1. **Rich Text Editor** for descriptions
2. **Variant Management** components
3. **Bulk Actions** components
4. **Advanced Filtering** components
5. **Real-time Validation** integration
6. **Drag & Drop** for images
7. **Category Tree** selector
8. **Dynamic Pricing** rules

### Potential Improvements

-   Form validation at component level
-   Loading states for individual components
-   Error boundaries
-   Accessibility improvements
-   Internationalization support

## Dependencies

-   React 18+
-   TypeScript
-   Tailwind CSS
-   shadcn/ui components
-   Lucide React icons
-   Next.js 14+

## File Structure

```
src/components/admin/dashboard/products/
├── index.ts                      # Export barrel
├── ProductBasicInfo.tsx         # Basic information
├── ProductPricing.tsx           # Pricing & inventory
├── ProductPhysicalAttributes.tsx # Physical properties
├── ProductCustomAttributes.tsx   # Custom attributes
├── ProductSpecifications.tsx     # Technical specs
├── ProductSEO.tsx              # SEO settings
├── ProductImages.tsx           # Image management
├── ProductStatus.tsx           # Status & visibility
├── ProductTags.tsx            # Tag management
├── ProductActions.tsx         # Action buttons
└── README.md                  # This file
```

## Contributing

When adding new components:

1. Follow the established naming convention: `Product[Feature].tsx`
2. Include proper TypeScript interfaces
3. Add to the index.ts export file
4. Update this README with component details
5. Ensure consistent styling with shadcn/ui
6. Add prop validation and documentation
