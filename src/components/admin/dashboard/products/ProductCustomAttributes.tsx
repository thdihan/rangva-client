"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Tag } from "lucide-react";

interface CustomAttribute {
    key: string;
    value: string;
}

interface ProductCustomAttributesProps {
    customAttributes: CustomAttribute[];
    onAddAttribute: () => void;
    onUpdateAttribute: (
        index: number,
        field: "key" | "value",
        value: string
    ) => void;
    onRemoveAttribute: (index: number) => void;
}

export default function ProductCustomAttributes({
    customAttributes,
    onAddAttribute,
    onUpdateAttribute,
    onRemoveAttribute,
}: ProductCustomAttributesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Custom Attributes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {customAttributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label>Attribute Name</Label>
                            <Input
                                value={attr.key}
                                onChange={(e) =>
                                    onUpdateAttribute(
                                        index,
                                        "key",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., Color, Size"
                            />
                        </div>
                        <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                                value={attr.value}
                                onChange={(e) =>
                                    onUpdateAttribute(
                                        index,
                                        "value",
                                        e.target.value
                                    )
                                }
                                placeholder="e.g., Red, Large"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveAttribute(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={onAddAttribute}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                </Button>
            </CardContent>
        </Card>
    );
}
