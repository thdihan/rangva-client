"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

import { Gallery } from "@/types/gallery.types";
import ImageViewer from "@/components/admin/dashboard/gallery/ImageViewer";
import ImageUploader from "@/components/admin/dashboard/gallery/ImageUploader";
import { getAllImages } from "@/service/actions/gallery";

export default function GalleryPage() {
    const [images, setImages] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch images on component mount
    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getAllImages();

                console.log("[LOG] : Gallery Response", res);

                if (res.success) {
                    setImages(res.data);
                } else {
                    setError(res.message || "Failed to fetch images");
                }
            } catch (err) {
                console.error("Error fetching images:", err);
                setError("Failed to fetch images");
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []); // Empty dependency array - runs only once on mount

    // Refresh images function (can be called after upload/delete)
    const refreshImages = async () => {
        try {
            const res = await getAllImages();
            if (res.success) {
                setImages(res.data);
            }
        } catch (err) {
            console.error("Error refreshing images:", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Image Gallery
                </h1>
                <ImageUploader
                    images={images}
                    setImages={setImages}
                    onUploadSuccess={refreshImages}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading images...</span>
                </div>
            )}

            {/* Stats */}
            {!loading && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Images
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {images.length}
                                    </p>
                                </div>
                                <ImageIcon className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Active Images
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            images.filter((img) => img.isActive)
                                                .length
                                        }
                                    </p>
                                </div>
                                <ImageIcon className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Local Storage
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            images.filter(
                                                (img) =>
                                                    img.storageType === "local"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <ImageIcon className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Cloud Storage
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            images.filter(
                                                (img) =>
                                                    img.storageType ===
                                                    "cloudinary"
                                            ).length
                                        }
                                    </p>
                                </div>
                                <ImageIcon className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Image Grid */}
            {!loading && (
                <ImageViewer
                    images={images}
                    onImageUpdate={refreshImages}
                    onImageDelete={refreshImages}
                />
            )}
        </div>
    );
}
