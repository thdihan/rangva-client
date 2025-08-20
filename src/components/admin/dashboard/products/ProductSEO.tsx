"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { CreateProductData } from "@/types/product.types";

interface ProductSEOProps {
    formData: CreateProductData;
    onInputChange: (field: keyof CreateProductData, value: any) => void;
}

export default function ProductSEO({
    formData,
    onInputChange,
}: ProductSEOProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    SEO Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) =>
                            onInputChange("metaTitle", e.target.value)
                        }
                        placeholder="SEO title for search engines"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) =>
                            onInputChange("metaDescription", e.target.value)
                        }
                        placeholder="SEO description for search engines"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                        id="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={(e) =>
                            onInputChange("metaKeywords", e.target.value)
                        }
                        placeholder="keyword1, keyword2, keyword3"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
