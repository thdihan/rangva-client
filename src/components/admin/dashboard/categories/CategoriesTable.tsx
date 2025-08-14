import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Edit, Trash2 } from "lucide-react";
import { TCategoryResponse } from "@/types/product.types";
import { format } from "date-fns";

// const categories = [
//     {
//         id: "CAT001",
//         name: "Electronics",
//         description: "Electronic devices and accessories",
//         products: 156,
//         status: "Active",
//         created: "Jan 15, 2024",
//         icon: "💻",
//     },
//     {
//         id: "CAT002",
//         name: "Sports & Fitness",
//         description: "Sports equipment and fitness gear",
//         products: 89,
//         status: "Active",
//         created: "Jan 20, 2024",
//         icon: "⚽",
//     },
//     {
//         id: "CAT003",
//         name: "Home & Garden",
//         description: "Home decor and garden supplies",
//         products: 234,
//         status: "Active",
//         created: "Feb 5, 2024",
//         icon: "🏠",
//     },
//     {
//         id: "CAT004",
//         name: "Fashion",
//         description: "Clothing and accessories",
//         products: 67,
//         status: "Inactive",
//         created: "Feb 12, 2024",
//         icon: "👕",
//     },
//     {
//         id: "CAT005",
//         name: "Books & Media",
//         description: "Books, movies, and digital media",
//         products: 123,
//         status: "Active",
//         created: "Mar 1, 2024",
//         icon: "📚",
//     },
// ];
type Props = {
    categories: TCategoryResponse;
};

function CategoriesTable({ categories }: Props) {
    console.log("Categories Table", categories);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories?.length > 0 &&
                    categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                        {/* {category.image} */}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {category.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {category.description}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">
                                {/* {category.products}  */} 3
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        category.isActive === true
                                            ? "border-green-500 text-green-700 bg-green-50"
                                            : "border-gray-500 text-gray-700 bg-gray-50"
                                    }
                                >
                                    {category.isActive === true
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(category.createdAt as string),
                                    "dd/MM/yyyy"
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );
}

export default CategoriesTable;
