"use server";

import { revalidateTag } from "next/cache";
import { TCategory } from "@/types/product.types";

export const createCategory = async (data: TCategory, token: string) => {
    console.log("[LOG] createCategory() -> Called with date", data);
    console.log("[LOG] createCategory() -> Called with token", token);
    const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: JSON.stringify(data),
            cache: "no-store",
        }
    );

    const newCategory = await result.json();
    revalidateTag("categories");
    return newCategory;
};

export const getAllCategories = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category`,
        {
            next: {
                tags: ["categories"],
                revalidate: 30,
            },
            cache: "force-cache",
        }
    );

    const categories = await res.json();

    return categories;
};

export const deleteCategory = async (id: string, access: string) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: access,
            },
        }
    );

    const deletedCategory = await res.json();
    revalidateTag("categories");
    return deletedCategory;
};
