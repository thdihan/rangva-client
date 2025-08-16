"use client";
import React, { Dispatch, SetStateAction } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, X, Plus } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Gallery } from "@/types/gallery.types";
import { formatFileSize } from "@/utils/formatFileSize";
import { uploadImages } from "@/service/gallery.service";

type Props = {
    images: Gallery[];
    setImages: Dispatch<SetStateAction<Gallery[]>>;
    onUploadSuccess?: () => void;
};

function ImageUploader({ images, setImages, onUploadSuccess }: Props) {
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
        maxSize: 10 * 1024 * 1024, // 10MB limit on client-side
        onDropRejected: (fileRejections) => {
            fileRejections.forEach((rejection) => {
                rejection.errors.forEach((error) => {
                    if (error.code === "file-too-large") {
                        toast.error(
                            `File ${rejection.file.name} is too large. Maximum size is 10MB.`
                        );
                    } else if (error.code === "file-invalid-type") {
                        toast.error(
                            `File ${rejection.file.name} has an invalid type. Only images are allowed.`
                        );
                    }
                });
            });
        },
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        try {
            // Prepare custom names for upload
            const customNamesForUpload: { [key: number]: string } = {};
            Object.entries(customNames).forEach(([index, name]) => {
                if (name.trim()) {
                    customNamesForUpload[parseInt(index)] = name
                        .trim()
                        .split(".")[0]; // Remove extension if included
                }
            });

            // Use the gallery action to upload images
            const result = await uploadImages({
                files: selectedFiles,
                customNames:
                    Object.keys(customNamesForUpload).length > 0
                        ? customNamesForUpload
                        : undefined,
            });

            if (result.success) {
                toast.success(
                    `${selectedFiles.length} image(s) uploaded successfully!`
                );

                // Call the onUploadSuccess callback to refresh the images
                if (onUploadSuccess) {
                    onUploadSuccess();
                } else {
                    // Fallback: Add uploaded images to state
                    setImages((prev) => [...prev, ...result.data]);
                }

                // Reset form
                setSelectedFiles([]);
                setCustomNames({});
                setIsDialogOpen(false);
            } else {
                toast.error(result.message || "Failed to upload images");
            }
        } catch (error) {
            toast.error("Failed to upload images");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
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
                                Drag and drop images here, or click to select
                                files
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
                                            value={customNames[index] || ""}
                                            onChange={(e) =>
                                                setCustomNames((prev) => ({
                                                    ...prev,
                                                    [index]: e.target.value,
                                                }))
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
                                            prev.filter((_, i) => i !== index)
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
                        disabled={selectedFiles.length === 0 || isUploading}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                        {isUploading
                            ? "Uploading..."
                            : `Upload ${selectedFiles.length} Image(s)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ImageUploader;
