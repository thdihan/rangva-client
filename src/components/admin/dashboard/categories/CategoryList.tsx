"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import CategoriesTable from "@/components/admin/dashboard/categories/CategoriesTable";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback } from "react";
import { TCategoryResponse } from "@/types/product.types";

import { useDebounce } from "@/hooks/useDebounce";
import { searchCategories } from "@/service/actions/searchCategories";

type Props = {
    initialCategories: TCategoryResponse;
};

function CategoryList({ initialCategories }: Props) {
    const [categories, setCategories] =
        useState<TCategoryResponse>(initialCategories);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Debounce search term to avoid too many API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const handleSearch = useCallback(
        async (term: string) => {
            setIsLoading(true);
            try {
                if (term.trim() === "") {
                    // If search is empty, show initial categories
                    setCategories(initialCategories);
                } else {
                    // Call API with search term
                    const searchResults = await searchCategories(term);
                    console.log("Search Result", searchResults);
                    setCategories(searchResults);
                }
            } catch (error) {
                console.error("Search failed:", error);
                // On error, keep showing current categories
            } finally {
                setIsLoading(false);
            }
        },
        [initialCategories]
    );

    // Effect to trigger search when debounced term changes
    useEffect(() => {
        handleSearch(debouncedSearchTerm);
    }, [debouncedSearchTerm, handleSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>All Categories</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search categories..."
                            className="pl-10 w-80"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <CategoriesTable categories={categories} />
            </CardContent>
        </Card>
    );
}

export default CategoryList;
