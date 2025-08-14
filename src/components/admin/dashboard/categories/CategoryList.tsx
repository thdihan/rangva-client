import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import CategoriesTable from "@/components/admin/dashboard/categories/CategoriesTable";
import { Input } from "@/components/ui/input";
import React from "react";
import { TCategoryResponse } from "@/types/product.types";

type Props = {
    categories: TCategoryResponse;
};

function CategoryList({ categories }: Props) {
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
                        />
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
