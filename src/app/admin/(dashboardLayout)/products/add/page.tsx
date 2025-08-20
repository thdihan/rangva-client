"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateProductData } from "@/types/product.types";
import { Gallery } from "@/types/gallery.types";
import { toast } from "sonner";
import { createProductService } from "@/service/product.service";
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

export default function AddProductPage() {
    const [formData, setFormData] = useState<CreateProductData>({
        name: "",
        description: "",
        shortDescription: "",
        price: 0,
        salePrice: 0,
        costPrice: 0,
        sku: "",
        stock: 0,
        minStock: 0,
        maxStock: undefined,
        trackStock: true,
        weight: 0,
        dimensions: "",
        status: "DRAFT",
        isActive: true,
        isFeatured: false,
        isDigital: false,
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        images: [],
        thumbnail: "",
        gallery: [],
        categoryId: "",
        attributes: {},
        specifications: {},
        tags: [],
    });

    // Image management state
    const [selectedImages, setSelectedImages] = useState<Gallery[]>([]);
    const [thumbnailImage, setThumbnailImage] = useState<Gallery | null>(null);

    const [customAttributes, setCustomAttributes] = useState<
        Array<{ key: string; value: string }>
    >([]);
    const [customSpecs, setCustomSpecs] = useState<
        Array<{ key: string; value: string }>
    >([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof CreateProductData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        handleInputChange("name", name);
        if (!formData.slug) {
            handleInputChange("slug", generateSlug(name));
        }
    };

    // Custom attributes handlers
    const addCustomAttribute = () => {
        setCustomAttributes((prev) => [...prev, { key: "", value: "" }]);
    };

    const updateCustomAttribute = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        setCustomAttributes((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const removeCustomAttribute = (index: number) => {
        setCustomAttributes((prev) => prev.filter((_, i) => i !== index));
    };

    // Custom specifications handlers
    const addCustomSpec = () => {
        setCustomSpecs((prev) => [...prev, { key: "", value: "" }]);
    };

    const updateCustomSpec = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        setCustomSpecs((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const removeCustomSpec = (index: number) => {
        setCustomSpecs((prev) => prev.filter((_, i) => i !== index));
    };

    // Tag handlers
    const addTag = () => {
        if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            setSelectedTags((prev) => [...prev, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    // Image selection handlers
    const handleImageSelection = (images: Gallery[]) => {
        setSelectedImages(images);
        const imageUrls = images.map((img) => img.url);
        const galleryIds = images.map((img) => img.id);

        handleInputChange("images", imageUrls);
        handleInputChange("gallery", galleryIds);

        if (!thumbnailImage && images.length > 0) {
            setThumbnailImage(images[0]);
            handleInputChange("thumbnail", images[0].url);
        }
    };

    const handleThumbnailSelection = (images: Gallery[]) => {
        if (images.length > 0) {
            const thumbnail = images[0];
            setThumbnailImage(thumbnail);
            handleInputChange("thumbnail", thumbnail.url);

            if (!selectedImages.some((img) => img.id === thumbnail.id)) {
                const updatedImages = [...selectedImages, thumbnail];
                setSelectedImages(updatedImages);
                handleInputChange(
                    "images",
                    updatedImages.map((img) => img.url)
                );
                handleInputChange(
                    "gallery",
                    updatedImages.map((img) => img.id)
                );
            }
        }
    };

    const removeImage = (imageToRemove: Gallery) => {
        const updatedImages = selectedImages.filter(
            (img) => img.id !== imageToRemove.id
        );
        setSelectedImages(updatedImages);
        handleInputChange(
            "images",
            updatedImages.map((img) => img.url)
        );
        handleInputChange(
            "gallery",
            updatedImages.map((img) => img.id)
        );

        if (thumbnailImage?.id === imageToRemove.id) {
            const newThumbnail =
                updatedImages.length > 0 ? updatedImages[0] : null;
            setThumbnailImage(newThumbnail);
            handleInputChange("thumbnail", newThumbnail?.url || "");
        }
    };

    const setAsThumbnail = (image: Gallery) => {
        setThumbnailImage(image);
        handleInputChange("thumbnail", image.url);
    };

    const removeThumbnail = () => {
        setThumbnailImage(null);
        handleInputChange("thumbnail", "");
    };

    const handleSubmit = async (isDraft: boolean = false) => {
        try {
            setIsLoading(true);

            // Convert custom attributes and specs to objects
            const attributes = customAttributes.reduce((acc, attr) => {
                if (attr.key && attr.value) {
                    acc[attr.key] = attr.value;
                }
                return acc;
            }, {} as Record<string, any>);

            const specifications = customSpecs.reduce((acc, spec) => {
                if (spec.key && spec.value) {
                    acc[spec.key] = spec.value;
                }
                return acc;
            }, {} as Record<string, any>);

            const submitData: CreateProductData = {
                ...formData,
                status: isDraft ? "DRAFT" : formData.status,
                attributes:
                    Object.keys(attributes).length > 0 ? attributes : undefined,
                specifications:
                    Object.keys(specifications).length > 0
                        ? specifications
                        : undefined,
                tags: selectedTags,
            };

            const result = await createProductService(submitData);

            if (result.success) {
                toast.success(
                    `Product ${
                        isDraft ? "saved as draft" : "created"
                    } successfully!`
                );
                console.log("Created product:", result.data);
            } else {
                toast.error(result.message || "Failed to create product");
            }
        } catch (error) {
            toast.error("Failed to create product");
            console.error("Create product error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    Add New Product
                </h1>
            </div>

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
        </div>
    );
}
