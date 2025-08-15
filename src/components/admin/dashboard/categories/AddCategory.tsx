"use client";
import React, { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAccessKey, getUserInfo } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";
import { createCategory } from "@/service/actions/category";

type Props = {};

function AddCategory({}: Props) {
    const token = getAccessKey(adminAccessToken);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        description: "",
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            console.log(
                "[LOG] Category create data (before submit) ",
                formData
            );

            console.log("[LOG] Token (before submit) ", token);
            const result = await createCategory(formData, token as string);

            console.log("[LOG] Category create data (response) ", result);
            toast.success(result.message);
            setFormData({
                name: "",
                image: "",
                description: "",
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
                toast.error(err.message);
            } else {
                console.error("An unexpected error occurred");
                toast.error("Category create failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                            id="category-name"
                            placeholder="Enter category name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category-description">
                            Description
                        </Label>
                        <Input
                            id="category-description"
                            placeholder="Enter description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category-icon">Icon (Image)</Label>
                        <Input
                            id="category-icon"
                            placeholder="Image Link"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                        Create Category
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default AddCategory;
