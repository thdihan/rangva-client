"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExportMenu } from "@/components/admin/dashboard/export-menu";
import { Product } from "@/types/product.types";

interface ProductsPageHeaderProps {
    products: Product[];
    selectedProducts: string[];
}

export function ProductsPageHeader({
    products,
    selectedProducts,
}: ProductsPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <div className="flex items-center gap-2">
                <ExportMenu
                    data={products as any[]}
                    entityType="products"
                    selectedItems={
                        selectedProducts.length > 0
                            ? (products.filter((product) =>
                                  selectedProducts.includes(product.id)
                              ) as any[])
                            : undefined
                    }
                />
                <Link href="/admin/products/add">
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>
        </div>
    );
}
