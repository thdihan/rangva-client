import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gallery } from "@/types/gallery.types";
import { Download, ImageIcon, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/formatFileSize";
import { deleteImage, toggleImageStatus } from "@/service/actions/gallery";
import { getAccessKey } from "@/service/auth.service";
import { adminAccessToken } from "@/constant";

type Props = {
    images: Gallery[];
    onImageUpdate?: () => void;
    onImageDelete?: () => void;
};

function ImageViewer({ images, onImageUpdate, onImageDelete }: Props) {
    const handleDelete = async (id: string) => {
        try {
            // Note: You'll need to get the auth token here
            const token = getAccessKey(adminAccessToken); // Implement this based on your auth system
            const result = await deleteImage(id, token as string);

            console.log("[LOG] Image Delete Response", result);

            // For now, just show success message
            toast.success("Image deleted successfully");
            if (onImageDelete) {
                onImageDelete();
            }
        } catch (error) {
            toast.error("Failed to delete image");
            console.error("Delete error:", error);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            // Note: You'll need to get the auth token here
            const token = getAccessKey(adminAccessToken); // Implement this based on your auth system
            const result = await toggleImageStatus(
                id,
                !currentStatus,
                token as string
            );

            console.log("[LOG] Image Status Response", result);
            toast.success(
                `Image ${
                    !currentStatus ? "activated" : "deactivated"
                } successfully`
            );
            if (onImageUpdate) {
                onImageUpdate();
            }
        } catch (error) {
            toast.error("Failed to update image status");
            console.error("Toggle status error:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
                {images.length === 0 ? (
                    <div className="text-center py-12">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                            No images uploaded yet
                        </p>
                        <p className="text-sm text-gray-400">
                            Upload your first image to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="w-full h-full object-cover border border-gray-200"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                window.open(image.url, "_blank")
                                            }
                                            title="Download"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={
                                                image.isActive
                                                    ? "outline"
                                                    : "default"
                                            }
                                            onClick={() =>
                                                handleToggleStatus(
                                                    image.id,
                                                    image.isActive
                                                )
                                            }
                                            title={
                                                image.isActive
                                                    ? "Deactivate"
                                                    : "Activate"
                                            }
                                        >
                                            {image.isActive ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(image.id)
                                            }
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="absolute top-2 left-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            image.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {image.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Storage Type Badge */}
                                <div className="absolute top-2 right-2">
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            image.storageType === "local"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-purple-100 text-purple-800"
                                        }`}
                                    >
                                        {image.storageType === "local"
                                            ? "Local"
                                            : "Cloud"}
                                    </span>
                                </div>

                                {/* Image Info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="truncate font-medium">
                                        {image.name}
                                    </p>
                                    <p className="text-gray-300">
                                        {formatFileSize(image.size)} •{" "}
                                        {image.mimeType}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {new Date(
                                            image.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ImageViewer;
