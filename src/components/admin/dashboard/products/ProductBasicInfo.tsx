"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Package, Loader2, RefreshCw } from "lucide-react";
import { CreateProductData, TCategory } from "@/types/product.types";
import { getAllCategories } from "@/service/actions/category";
import { Button } from "@/components/ui/button";

interface ProductBasicInfoProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
    onNameChange: (name: string) => void;
    generateSlug: (name: string) => string;
}

export default function ProductBasicInfo({
    formData,
    onInputChange,
    onNameChange,
    generateSlug,
}: ProductBasicInfoProps) {
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await getAllCategories();

            // Check if response has the expected structure
            if (response?.success && response?.data) {
                setCategories(response.data);
            } else if (Array.isArray(response)) {
                // Handle direct array response (fallback)
                setCategories(response);
            } else {
                console.error(
                    "Failed to load categories:",
                    response?.message || "Unknown error"
                );
                setCategories([]);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Enter product name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                        id="slug"
                        value={formData.slug || generateSlug(formData.name)}
                        onChange={(e) => onInputChange("slug", e.target.value)}
                        placeholder="product-url-slug"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                        id="shortDescription"
                        value={formData.shortDescription}
                        onChange={(e) =>
                            onInputChange("shortDescription", e.target.value)
                        }
                        placeholder="Brief product description"
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            onInputChange("description", e.target.value)
                        }
                        placeholder="Detailed product description"
                        rows={4}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="category">Category *</Label>
                            {!loadingCategories && categories.length === 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={loadCategories}
                                    className="h-6 px-2 text-xs"
                                >
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Retry
                                </Button>
                            )}
                        </div>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) =>
                                onInputChange("categoryId", value)
                            }
                            disabled={loadingCategories}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loadingCategories
                                            ? "Loading categories..."
                                            : "Select category"
                                    }
                                />
                                {loadingCategories && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0
                                    ? categories
                                          .filter(
                                              (category) =>
                                                  category.isActive !== false
                                          )
                                          .map((category) => (
                                              <SelectItem
                                                  key={category.id}
                                                  value={category.id!}
                                              >
                                                  {category.name}
                                                  {category.description && (
                                                      <span className="text-xs text-gray-500 ml-2">
                                                          -{" "}
                                                          {category.description}
                                                      </span>
                                                  )}
                                              </SelectItem>
                                          ))
                                    : !loadingCategories && (
                                          <SelectItem value="" disabled>
                                              No categories available - Please
                                              create categories first
                                          </SelectItem>
                                      )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            value={formData.sku}
                            onChange={(e) =>
                                onInputChange("sku", e.target.value)
                            }
                            placeholder="Enter SKU"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
