"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { CreateProductData } from "@/types/product.types";

interface ProductPhysicalAttributesProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
}

export default function ProductPhysicalAttributes({
    formData,
    onInputChange,
}: ProductPhysicalAttributesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Physical Attributes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            step="0.001"
                            value={formData.weight}
                            onChange={(e) =>
                                onInputChange(
                                    "weight",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="0.000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dimensions">
                            Dimensions (L x W x H)
                        </Label>
                        <Input
                            id="dimensions"
                            value={formData.dimensions}
                            onChange={(e) =>
                                onInputChange("dimensions", e.target.value)
                            }
                            placeholder="e.g., 10 x 5 x 3 cm"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isDigital"
                        checked={formData.isDigital}
                        onCheckedChange={(checked) =>
                            onInputChange("isDigital", checked)
                        }
                    />
                    <Label htmlFor="isDigital">This is a digital product</Label>
                </div>
            </CardContent>
        </Card>
    );
}
