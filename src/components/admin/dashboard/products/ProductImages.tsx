"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, X } from "lucide-react";
import { Gallery } from "@/types/gallery.types";
import ImageSelector from "@/components/admin/dashboard/gallery/ImageSelector";

interface ProductImagesProps {
    selectedImages: Gallery[];
    thumbnailImage: Gallery | null;
    onImageSelection: (images: Gallery[]) => void;
    onThumbnailSelection: (images: Gallery[]) => void;
    onRemoveImage: (image: Gallery) => void;
    onSetAsThumbnail: (image: Gallery) => void;
    onRemoveThumbnail: () => void;
}

export default function ProductImages({
    selectedImages,
    thumbnailImage,
    onImageSelection,
    onThumbnailSelection,
    onRemoveImage,
    onSetAsThumbnail,
    onRemoveThumbnail,
}: ProductImagesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Gallery Images */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Gallery Images</Label>
                        <ImageSelector
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Select Images
                                </Button>
                            }
                            onImageSelect={onImageSelection}
                            multiple={true}
                            selectedImages={selectedImages}
                            title="Select Product Images"
                        />
                    </div>

                    {selectedImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            {selectedImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                    <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Image controls */}
                                    <div className="absolute inset-0 bg-opacity-1 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    onSetAsThumbnail(image)
                                                }
                                                disabled={
                                                    thumbnailImage?.id ===
                                                    image.id
                                                }
                                            >
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    onRemoveImage(image)
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Thumbnail indicator */}
                                    {thumbnailImage?.id === image.id && (
                                        <div className="absolute top-2 left-2">
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                Thumbnail
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Image order */}
                                    <div className="absolute top-2 right-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-white"
                                        >
                                            {index + 1}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-2">
                                No images selected
                            </p>
                            <p className="text-xs text-gray-400">
                                Click "Select Images" to choose from gallery or
                                upload new ones
                            </p>
                        </div>
                    )}
                </div>

                {/* Thumbnail Selection */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Product Thumbnail</Label>
                        <ImageSelector
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Select Thumbnail
                                </Button>
                            }
                            onImageSelect={onThumbnailSelection}
                            multiple={false}
                            selectedImages={
                                thumbnailImage ? [thumbnailImage] : []
                            }
                            title="Select Product Thumbnail"
                        />
                    </div>

                    {thumbnailImage ? (
                        <div className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="w-16 h-16 border rounded overflow-hidden">
                                <img
                                    src={thumbnailImage.url}
                                    alt={thumbnailImage.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {thumbnailImage.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {thumbnailImage.originalName}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRemoveThumbnail}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                                No thumbnail selected
                            </p>
                            <p className="text-xs text-gray-400">
                                Select a featured image for your product
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
