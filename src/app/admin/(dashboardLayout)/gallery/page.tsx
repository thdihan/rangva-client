"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Upload,
    Image as ImageIcon,
    X,
    Download,
    Trash2,
    Plus,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ImageFile {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [customNames, setCustomNames] = useState<{ [key: string]: string }>(
        {}
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
        // Initialize custom names with original file names
        const names: { [key: string]: string } = {};
        acceptedFiles.forEach((file, index) => {
            names[index] = file.name.split(".")[0]; // Remove extension
        });
        setCustomNames(names);
        setIsDialogOpen(true);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        multiple: true,
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const customName = customNames[i] || file.name.split(".")[0];
                const extension = file.name.split(".").pop();

                // Create FormData
                const formData = new FormData();
                formData.append("image", file);
                formData.append("name", `${customName}.${extension}`);

                // Simulate upload - replace with actual API call
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const uploadedImage = await response.json();
                    setImages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString() + i,
                            name: `${customName}.${extension}`,
                            url: URL.createObjectURL(file), // Temporary URL
                            size: file.size,
                            uploadedAt: new Date().toISOString(),
                        },
                    ]);
                }
            }

            toast.success(
                `${selectedFiles.length} image(s) uploaded successfully!`
            );
            setSelectedFiles([]);
            setCustomNames({});
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to upload images");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
        toast.success("Image deleted successfully");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Image Gallery
                </h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Images
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Upload Images</DialogTitle>
                            <DialogDescription>
                                Drag and drop images or click to select files
                            </DialogDescription>
                        </DialogHeader>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                isDragActive
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-gray-300 hover:border-orange-400"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            {isDragActive ? (
                                <p className="text-orange-600">
                                    Drop the images here...
                                </p>
                            ) : (
                                <div>
                                    <p className="text-gray-600 mb-2">
                                        Drag and drop images here, or click to
                                        select files
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Supports: JPG, JPEG, PNG, GIF, WebP
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Selected Files with Custom Names */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-4 max-h-60 overflow-y-auto">
                                <h3 className="font-medium">Selected Files:</h3>
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <div className="text-sm text-gray-600">
                                                Original: {file.name} (
                                                {formatFileSize(file.size)})
                                            </div>
                                            <div className="space-y-1">
                                                <Label
                                                    htmlFor={`name-${index}`}
                                                    className="text-xs"
                                                >
                                                    Custom Name
                                                </Label>
                                                <Input
                                                    id={`name-${index}`}
                                                    value={
                                                        customNames[index] || ""
                                                    }
                                                    onChange={(e) =>
                                                        setCustomNames(
                                                            (prev) => ({
                                                                ...prev,
                                                                [index]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Enter custom name"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedFiles((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                                setCustomNames((prev) => {
                                                    const {
                                                        [index]: removed,
                                                        ...rest
                                                    } = prev;
                                                    return rest;
                                                });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedFiles([]);
                                    setCustomNames({});
                                    setIsDialogOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={
                                    selectedFiles.length === 0 || isUploading
                                }
                                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                            >
                                {isUploading
                                    ? "Uploading..."
                                    : `Upload ${selectedFiles.length} Image(s)`}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
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
            </div>

            {/* Image Grid */}
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
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    window.open(
                                                        image.url,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDelete(image.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Image Info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="truncate font-medium">
                                            {image.name}
                                        </p>
                                        <p className="text-gray-300">
                                            {formatFileSize(image.size)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
