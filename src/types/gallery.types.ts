export interface Gallery {
    id: string;
    name: string;
    originalName: string;
    url: string;
    cloudinaryId?: string;
    localPath?: string;
    storageType: "local" | "cloudinary";
    size: number;
    mimeType: string;
    isActive: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryResponse {
    success: boolean;
    status: number;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: Gallery[];
}

export interface SingleGalleryResponse {
    success: boolean;
    status: number;
    message: string;
    data: Gallery;
}

export interface UploadImageData {
    files: File[];
    customNames?: { [key: number]: string };
}

export interface UpdateImageData {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface DeleteMultipleImagesData {
    ids: string[];
}

// Legacy interface for backward compatibility
export interface ImageFile {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
}
