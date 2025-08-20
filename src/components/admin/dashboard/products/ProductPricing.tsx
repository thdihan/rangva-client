"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign } from "lucide-react";
import { CreateProductData } from "@/types/product.types";

interface ProductPricingProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
}

export default function ProductPricing({
    formData,
    onInputChange,
}: ProductPricingProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing & Inventory
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="price">Regular Price *</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                                onInputChange(
                                    "price",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="salePrice">Sale Price</Label>
                        <Input
                            id="salePrice"
                            type="number"
                            step="0.01"
                            value={formData.salePrice}
                            onChange={(e) =>
                                onInputChange(
                                    "salePrice",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="costPrice">Cost Price</Label>
                        <Input
                            id="costPrice"
                            type="number"
                            step="0.01"
                            value={formData.costPrice}
                            onChange={(e) =>
                                onInputChange(
                                    "costPrice",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) =>
                                onInputChange(
                                    "stock",
                                    parseInt(e.target.value) || 0
                                )
                            }
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="minStock">Minimum Stock</Label>
                        <Input
                            id="minStock"
                            type="number"
                            value={formData.minStock}
                            onChange={(e) =>
                                onInputChange(
                                    "minStock",
                                    parseInt(e.target.value) || 0
                                )
                            }
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxStock">Maximum Stock</Label>
                        <Input
                            id="maxStock"
                            type="number"
                            value={formData.maxStock || ""}
                            onChange={(e) =>
                                onInputChange(
                                    "maxStock",
                                    parseInt(e.target.value) || undefined
                                )
                            }
                            placeholder="Optional"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="trackStock"
                        checked={formData.trackStock}
                        onCheckedChange={(checked) =>
                            onInputChange("trackStock", checked)
                        }
                    />
                    <Label htmlFor="trackStock">Track stock quantity</Label>
                </div>
            </CardContent>
        </Card>
    );
}
