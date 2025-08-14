"use server";

import { TCategoryResponse } from "@/types/product.types";

export const searchCategories = async (
    searchTerm: string
): Promise<TCategoryResponse> => {
    const result = await fetch(
        `${
            process.env.NEXT_PUBLIC_BACKEND_API_URL
        }/category?searchTerm=${encodeURIComponent(searchTerm)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    if (!result.ok) {
        throw new Error("Failed to search categories");
    }

    const { data } = await result.json();
    return data;
};
