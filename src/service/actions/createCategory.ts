"use server";

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
    return newCategory;
};
