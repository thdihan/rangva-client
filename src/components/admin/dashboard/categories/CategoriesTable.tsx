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
import { TCategory, TCategoryResponse } from "@/types/product.types";
import { format } from "date-fns";
import { deleteCategory } from "@/service/actions/category";
import { getAccessKey, getUserInfo } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";
import { toast } from "sonner";
import EditCategory from "./EditCategory";

type Props = {
    categories: TCategoryResponse;
};

function CategoriesTable({ categories }: Props) {
    const accessToken = getAccessKey(adminAccessToken);
    console.log("Categories Table", categories);

    const handleDelete = async (category: TCategory) => {
        try {
            const res = await deleteCategory(
                category.id as string,
                accessToken as string
            );

            console.log(`[LOG] Delete Category (${category.name}): `, res);
            toast.success(res?.message);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
                toast.error(err.message);
            } else {
                console.error("An unexpected error occurred");
                toast.error("Category delete failed. Please try again.");
            }
        }
    };
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
                                    {/* <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button> */}
                                    <EditCategory
                                        category={category}
                                        token={accessToken as string}
                                    />
                                    <Button
                                        onClick={() => handleDelete(category)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 cursor-pointer"
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
