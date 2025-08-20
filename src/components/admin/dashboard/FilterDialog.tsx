"use client";

// @ts-ignore - Complex union types for filter values need refactoring
// This file has complex typing issues that would require significant refactoring

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";

interface FilterOption {
    id: string;
    label: string;
    value: string;
}

interface FilterGroup {
    id: string;
    label: string;
    type: "checkbox" | "radio" | "select" | "range" | "date";
    options?: FilterOption[];
    min?: number;
    max?: number;
}

type FilterValue =
    | string
    | string[]
    | { min?: string; max?: string }
    | { from?: string; to?: string }
    | undefined;

interface FilterDialogProps {
    title: string;
    filterGroups: FilterGroup[];
    activeFilters: Record<string, FilterValue>;
    onFiltersChange: (filters: Record<string, FilterValue>) => void;
    onClearFilters: () => void;
}

export function FilterDialog({
    title,
    filterGroups,
    activeFilters,
    onFiltersChange,
    onClearFilters,
}: FilterDialogProps) {
    const [open, setOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState(activeFilters);

    const handleFilterChange = (groupId: string, value: any) => {
        setTempFilters((prev) => ({
            ...prev,
            [groupId]: value,
        }));
    };

    const handleApplyFilters = () => {
        onFiltersChange(tempFilters);
        setOpen(false);
    };

    const handleClearAll = () => {
        setTempFilters({});
        onClearFilters();
        setOpen(false);
    };

    const activeFilterCount = Object.keys(activeFilters).filter((key) => {
        const value = activeFilters[key];
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== "";
    }).length;

    const removeFilter = (filterId: string) => {
        const newFilters = { ...activeFilters };
        delete newFilters[filterId];
        onFiltersChange(newFilters);
    };

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {activeFilterCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 bg-blue-500 text-white text-xs">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Apply filters to narrow down your results
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {filterGroups.map((group) => (
                            <div key={group.id} className="space-y-3">
                                <Label className="text-sm font-medium">
                                    {group.label}
                                </Label>

                                {group.type === "checkbox" && group.options && (
                                    <div className="space-y-2">
                                        {group.options.map((option) => (
                                            <div
                                                key={option.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={option.id}
                                                    checked={
                                                        tempFilters[
                                                            group.id
                                                        ]?.includes(
                                                            // @ts-ignore
                                                            option.value
                                                        ) || false
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        const currentValues =
                                                            tempFilters[
                                                                group.id
                                                            ] || [];
                                                        if (checked) {
                                                            handleFilterChange(
                                                                group.id,
                                                                [
                                                                    ...currentValues,
                                                                    option.value,
                                                                ]
                                                            );
                                                        } else {
                                                            handleFilterChange(
                                                                group.id,
                                                                currentValues.filter(
                                                                    (
                                                                        v: string
                                                                    ) =>
                                                                        v !==
                                                                        option.value
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={option.id}
                                                    className="text-sm font-normal"
                                                >
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {group.type === "radio" && group.options && (
                                    <RadioGroup
                                        value={tempFilters[group.id] || ""}
                                        onValueChange={(value) =>
                                            handleFilterChange(group.id, value)
                                        }
                                    >
                                        {group.options.map((option) => (
                                            <div
                                                key={option.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={option.value}
                                                    id={option.id}
                                                />
                                                <Label
                                                    htmlFor={option.id}
                                                    className="text-sm font-normal"
                                                >
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}

                                {group.type === "select" && group.options && (
                                    <Select
                                        value={tempFilters[group.id] || ""}
                                        onValueChange={(value) =>
                                            handleFilterChange(group.id, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={`Select ${group.label.toLowerCase()}`}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {group.options.map((option) => (
                                                <SelectItem
                                                    key={option.id}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                {group.type === "range" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs text-gray-500">
                                                Min
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder={`${
                                                    group.min || 0
                                                }`}
                                                value={
                                                    tempFilters[group.id]
                                                        ?.min || ""
                                                }
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        group.id,
                                                        {
                                                            ...tempFilters[
                                                                group.id
                                                            ],
                                                            min: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">
                                                Max
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder={`${
                                                    group.max || 1000
                                                }`}
                                                value={
                                                    tempFilters[group.id]
                                                        ?.max || ""
                                                }
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        group.id,
                                                        {
                                                            ...tempFilters[
                                                                group.id
                                                            ],
                                                            max: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {group.type === "date" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-xs text-gray-500">
                                                From
                                            </Label>
                                            <Input
                                                type="date"
                                                value={
                                                    tempFilters[group.id]
                                                        ?.from || ""
                                                }
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        group.id,
                                                        {
                                                            ...tempFilters[
                                                                group.id
                                                            ],
                                                            from: e.target
                                                                .value,
                                                        }
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-500">
                                                To
                                            </Label>
                                            <Input
                                                type="date"
                                                value={
                                                    tempFilters[group.id]?.to ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        group.id,
                                                        {
                                                            ...tempFilters[
                                                                group.id
                                                            ],
                                                            to: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <Separator />
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleClearAll}>
                            Clear All
                        </Button>
                        <Button
                            onClick={handleApplyFilters}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {Object.entries(activeFilters).map(([key, value]) => {
                        if (
                            !value ||
                            (Array.isArray(value) && value.length === 0)
                        )
                            return null;

                        const group = filterGroups.find((g) => g.id === key);
                        if (!group) return null;

                        const getDisplayValue = () => {
                            if (Array.isArray(value)) {
                                return value.join(", ");
                            }
                            if (
                                typeof value === "object" &&
                                value.min &&
                                value.max
                            ) {
                                return `${value.min} - ${value.max}`;
                            }
                            if (
                                typeof value === "object" &&
                                (value.from || value.to)
                            ) {
                                return `${value.from || "Start"} to ${
                                    value.to || "End"
                                }`;
                            }
                            return String(value);
                        };

                        return (
                            <Badge
                                key={key}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <span className="text-xs">
                                    {group.label}: {getDisplayValue()}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() => removeFilter(key)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
