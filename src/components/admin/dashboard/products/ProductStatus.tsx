"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreateProductData, type ProductStatus } from "@/types/product.types";

interface ProductStatusProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
}

export default function ProductStatus({
    formData,
    onInputChange,
}: ProductStatusProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        onValueChange={(value: ProductStatus) =>
                            onInputChange("status", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                            <SelectItem value="OUT_OF_STOCK">
                                Out of Stock
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                onInputChange("isActive", checked)
                            }
                        />
                        <Label htmlFor="isActive">
                            Active (visible on store)
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onCheckedChange={(checked) =>
                                onInputChange("isFeatured", checked)
                            }
                        />
                        <Label htmlFor="isFeatured">Featured product</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
