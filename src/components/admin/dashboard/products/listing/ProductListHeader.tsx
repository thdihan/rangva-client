"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { FilterDialog } from "@/components/admin/dashboard/FilterDialog";

interface ProductListHeaderProps {
    totalProducts: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    filters: Record<string, any>;
    filterGroups: any[];
    onSearchChange: (value: string) => void;
    onFiltersChange: (filters: Record<string, any>) => void;
    onClearFilters: () => void;
    onRetry: () => void;
}

export function ProductListHeader({
    totalProducts,
    loading,
    error,
    searchTerm,
    filters,
    filterGroups,
    onSearchChange,
    onFiltersChange,
    onClearFilters,
    onRetry,
}: ProductListHeaderProps) {
    return (
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>
                    All Products ({totalProducts})
                    {loading && (
                        <Loader2 className="inline-block h-4 w-4 ml-2 animate-spin" />
                    )}
                </CardTitle>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10 w-80"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <FilterDialog
                        title="Filter Products"
                        filterGroups={filterGroups}
                        activeFilters={filters}
                        onFiltersChange={onFiltersChange}
                        onClearFilters={onClearFilters}
                    />
                    {error && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            disabled={loading}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        </CardHeader>
    );
}
