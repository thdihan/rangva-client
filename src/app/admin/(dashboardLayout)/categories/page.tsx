import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Plus, FolderOpen } from "lucide-react";
import CategoriesTable from "@/components/admin/dashboard/categories/CategoriesTable";
import AddCategory from "@/components/admin/dashboard/categories/AddCategory";

export default function CategoriesPage() {
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
                                <p className="text-2xl font-bold">24</p>
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
                                <p className="text-2xl font-bold">21</p>
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

            {/* All Category List  */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
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
                            <CategoriesTable />
                        </CardContent>
                    </Card>
                </div>

                {/* New Category Add  */}
                <div>
                    <AddCategory />
                </div>
            </div>
        </div>
    );
}
