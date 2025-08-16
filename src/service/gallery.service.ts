"use client";

import { UploadImageData } from "@/types/gallery.types";
import { revalidateGallery } from "@/service/actions/gallery";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/**
 * Upload multiple images to gallery (Client-side function)
 * This avoids Next.js Server Action body size limits
 */
export const uploadImages = async (data: UploadImageData, token?: string) => {
    const formData = new FormData();

    // Append files
    data.files.forEach((file) => {
        formData.append("images", file);
    });

    // Append custom names if provided
    if (data.customNames) {
        formData.append("customNames", JSON.stringify(data.customNames));
    }

    const headers: Record<string, string> = {};
    if (token) {
        headers.Authorization = token;
    }

    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
        method: "POST",
        headers,
        body: formData,
        cache: "no-store",
    });

    const result = await response.json();

    // Trigger cache revalidation
    if (result.success) {
        try {
            await revalidateGallery();
        } catch (error) {
            console.warn("Failed to revalidate cache:", error);
        }
    }

    return result;
};

/**
 * Upload single image (convenience function)
 */
export const uploadSingleImage = async (
    file: File,
    customName?: string,
    token?: string
) => {
    const data: UploadImageData = {
        files: [file],
        customNames: customName ? { 0: customName } : undefined,
    };

    return uploadImages(data, token);
};
