import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Plus, FolderOpen } from "lucide-react";
import AddCategory from "@/components/admin/dashboard/categories/AddCategory";
import CategoryList from "@/components/admin/dashboard/categories/CategoryList";
import { TCategory, TCategoryResponse } from "@/types/product.types";

async function CategoriesPage() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category`,
        {
            next: {
                revalidate: 30,
            },
            cache: "force-cache",
        }
    );

    const { data: categories }: { data: TCategoryResponse } = await res.json();
    console.log("[LOG] CategoriesPage -> ", categories);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Categories
                                </p>
                                <p className="text-2xl font-bold">
                                    {categories.length}
                                </p>
                            </div>
                            <FolderOpen className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Active Categories
                                </p>
                                <p className="text-2xl font-bold">
                                    {
                                        categories?.filter(
                                            (cat: TCategory) =>
                                                cat.isActive === true
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Products
                                </p>
                                <p className="text-2xl font-bold">669</p>
                            </div>
                            <div className="text-2xl">📦</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Avg Products/Category
                                </p>
                                <p className="text-2xl font-bold">28</p>
                            </div>
                            <div className="text-2xl">📊</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CategoryList initialCategories={categories} />
                </div>

                {/* New Category Add  */}
                <div>
                    <AddCategory />
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;
