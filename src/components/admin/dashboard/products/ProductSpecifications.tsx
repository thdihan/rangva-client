"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface CustomSpecification {
    key: string;
    value: string;
}

interface ProductSpecificationsProps {
    customSpecs: CustomSpecification[];
    onAddSpec: () => void;
    onUpdateSpec: (
        index: number,
        field: "key" | "value",
        value: string
    ) => void;
    onRemoveSpec: (index: number) => void;
}

export default function ProductSpecifications({
    customSpecs,
    onAddSpec,
    onUpdateSpec,
    onRemoveSpec,
}: ProductSpecificationsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {customSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label>Specification</Label>
                            <Input
                                value={spec.key}
                                onChange={(e) =>
                                    onUpdateSpec(index, "key", e.target.value)
                                }
                                placeholder="e.g., Battery Life, Material"
                            />
                        </div>
                        <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                                value={spec.value}
                                onChange={(e) =>
                                    onUpdateSpec(index, "value", e.target.value)
                                }
                                placeholder="e.g., 24 hours, Aluminum"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveSpec(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <Button type="button" variant="outline" onClick={onAddSpec}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specification
                </Button>
            </CardContent>
        </Card>
    );
}
