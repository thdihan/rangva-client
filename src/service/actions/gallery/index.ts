"use server";

import { revalidateTag } from "next/cache";
import {
    GalleryResponse,
    SingleGalleryResponse,
    UpdateImageData,
    DeleteMultipleImagesData,
} from "@/types/gallery.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/**
 * Get all images from gallery with pagination and filtering
 */
export const getAllImages = async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    mimeType?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}): Promise<GalleryResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.append(key, value.toString());
            }
        });
    }

    const response = await fetch(
        `${API_BASE_URL}/gallery?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { tags: ["gallery"] },
            cache: "no-store",
        }
    );

    return await response.json();
};

/**
 * Get single image by ID
 */
export const getImageById = async (
    id: string
): Promise<SingleGalleryResponse> => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        next: { tags: ["gallery", `gallery-${id}`] },
    });

    return await response.json();
};

/**
 * Update image metadata
 */
export const updateImage = async (
    id: string,
    data: UpdateImageData,
    token: string
): Promise<SingleGalleryResponse> => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("gallery");
    revalidateTag(`gallery-${id}`);
    return result;
};

/**
 * Delete single image
 */
export const deleteImage = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: token,
        },
        cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("gallery");
    revalidateTag(`gallery-${id}`);
    return result;
};

/**
 * Delete multiple images
 */
export const deleteMultipleImages = async (
    data: DeleteMultipleImagesData,
    token: string
) => {
    const response = await fetch(`${API_BASE_URL}/gallery/bulk/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify(data),
        cache: "no-store",
    });

    const result = await response.json();
    revalidateTag("gallery");
    return result;
};

/**
 * Toggle image active status
 */
export const toggleImageStatus = async (
    id: string,
    isActive: boolean,
    token: string
) => {
    return updateImage(id, { isActive }, token);
};

/**
 * Revalidate gallery cache (Server Action)
 */
export const revalidateGallery = async () => {
    revalidateTag("gallery");
};
