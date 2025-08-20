"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Image as ImageIcon,
    Upload,
    Check,
    X,
    Search,
    Grid,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Gallery } from "@/types/gallery.types";
import { getAllImages } from "@/service/actions/gallery";
import { uploadImages } from "@/service/gallery.service";
import { useDropzone } from "react-dropzone";
import { formatFileSize } from "@/utils/formatFileSize";

interface ImageSelectorProps {
    trigger?: React.ReactNode;
    onImageSelect: (images: Gallery[]) => void;
    multiple?: boolean;
    selectedImages?: Gallery[];
    title?: string;
}

export default function ImageSelector({
    trigger,
    onImageSelect,
    multiple = false,
    selectedImages = [],
    title = "Select Images",
}: ImageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("gallery");
    const [images, setImages] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSelectedImages, setTempSelectedImages] =
        useState<Gallery[]>(selectedImages);

    // Upload tab state
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [customNames, setCustomNames] = useState<{ [key: number]: string }>(
        {}
    );

    // Fetch gallery images when dialog opens
    useEffect(() => {
        if (isOpen && activeTab === "gallery") {
            fetchImages();
        }
    }, [isOpen, activeTab]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await getAllImages({
                page: 1,
                limit: 50,
                searchTerm: searchTerm || undefined,
            });

            if (response.success) {
                setImages(response.data);
            } else {
                toast.error("Failed to load images");
            }
        } catch (error) {
            toast.error("Failed to load images");
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search images
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (activeTab === "gallery") {
                fetchImages();
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    // Handle image selection
    const handleImageToggle = (image: Gallery) => {
        if (multiple) {
            setTempSelectedImages((prev) => {
                const isSelected = prev.some((img) => img.id === image.id);
                if (isSelected) {
                    return prev.filter((img) => img.id !== image.id);
                } else {
                    return [...prev, image];
                }
            });
        } else {
            setTempSelectedImages([image]);
        }
    };

    // Check if image is selected
    const isImageSelected = (image: Gallery) => {
        return tempSelectedImages.some((img) => img.id === image.id);
    };

    // Dropzone for upload tab
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setUploadFiles(acceptedFiles);
            // Initialize custom names
            const names: { [key: number]: string } = {};
            acceptedFiles.forEach((file, index) => {
                names[index] = file.name.split(".")[0];
            });
            setCustomNames(names);
        },
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        },
        multiple: true,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    // Handle file upload
    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        setIsUploading(true);
        try {
            const customNamesForUpload: { [key: number]: string } = {};
            Object.entries(customNames).forEach(([index, name]) => {
                if (name.trim()) {
                    customNamesForUpload[parseInt(index)] = name.trim();
                }
            });

            const result = await uploadImages({
                files: uploadFiles,
                customNames:
                    Object.keys(customNamesForUpload).length > 0
                        ? customNamesForUpload
                        : undefined,
            });

            if (result.success) {
                toast.success(
                    `${uploadFiles.length} image(s) uploaded successfully!`
                );

                // Add uploaded images to gallery list and temp selection
                const newImages = result.data;
                setImages((prev) => [...newImages, ...prev]);

                if (multiple) {
                    setTempSelectedImages((prev) => [...prev, ...newImages]);
                } else {
                    setTempSelectedImages(newImages.slice(0, 1));
                }

                // Reset upload form
                setUploadFiles([]);
                setCustomNames({});

                // Switch to gallery tab to show uploaded images
                setActiveTab("gallery");
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

    // Handle selection confirmation
    const handleConfirm = () => {
        onImageSelect(tempSelectedImages);
        setIsOpen(false);
    };

    // Handle dialog close
    const handleClose = () => {
        setTempSelectedImages(selectedImages); // Reset to original selection
        setIsOpen(false);
        setUploadFiles([]);
        setCustomNames({});
        setSearchTerm("");
    };

    const filteredImages = images.filter(
        (image) =>
            image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) {
                    setIsOpen(true);
                    setTempSelectedImages(selectedImages);
                } else {
                    handleClose();
                }
            }}
        >
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {title}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {multiple
                            ? "Select multiple images from gallery or upload new ones"
                            : "Select an image from gallery or upload a new one"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex flex-col h-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="gallery"
                            className="flex items-center gap-2"
                        >
                            <Grid className="h-4 w-4" />
                            Gallery ({images.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="upload"
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload New
                        </TabsTrigger>
                    </TabsList>

                    {/* Gallery Tab */}
                    <TabsContent
                        value="gallery"
                        className="flex-1 overflow-hidden"
                    >
                        <div className="space-y-4 h-full flex flex-col">
                            <Input
                                placeholder="Search images..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className=""
                            />
                            {/* Search */}
                            {/* <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div> */}

                            {/* Selected Images Count */}
                            {tempSelectedImages.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {tempSelectedImages.length} selected
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setTempSelectedImages([])
                                        }
                                    >
                                        Clear selection
                                    </Button>
                                </div>
                            )}

                            {/* Images Grid */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <span className="ml-2">
                                            Loading images...
                                        </span>
                                    </div>
                                ) : filteredImages.length === 0 ? (
                                    <div className="text-center py-8">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-gray-600">
                                            No images found
                                        </p>
                                        {searchTerm && (
                                            <p className="text-sm text-gray-400">
                                                Try adjusting your search terms
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {filteredImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                                    isImageSelected(image)
                                                        ? "border-blue-500 ring-2 ring-blue-200"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    handleImageToggle(image)
                                                }
                                            >
                                                <div className="aspect-square overflow-hidden rounded-md">
                                                    <img
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>

                                                {/* Selection indicator */}
                                                <div
                                                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                        isImageSelected(image)
                                                            ? "bg-blue-500 border-blue-500"
                                                            : "bg-white border-gray-300 group-hover:border-gray-400"
                                                    }`}
                                                >
                                                    {isImageSelected(image) && (
                                                        <Check className="h-3 w-3 text-white" />
                                                    )}
                                                </div>

                                                {/* Image info overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="truncate">
                                                        {image.name}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        {formatFileSize(
                                                            image.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Upload Tab */}
                    <TabsContent value="upload" className="flex-1">
                        <div className="space-y-4">
                            {/* Dropzone */}
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                    isDragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                {isDragActive ? (
                                    <p className="text-blue-600">
                                        Drop the images here...
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-gray-600 mb-2">
                                            Drag and drop images here, or click
                                            to browse
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Supports: JPEG, PNG, GIF, WebP (max
                                            10MB each)
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Selected files for upload */}
                            {uploadFiles.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-medium">
                                        Files to upload ({uploadFiles.length}):
                                    </h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {uploadFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <Label className="text-xs">
                                                                Original Name
                                                            </Label>
                                                            <p className="text-sm font-medium truncate">
                                                                {file.name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor={`name-${index}`}
                                                                className="text-xs"
                                                            >
                                                                Custom Name
                                                            </Label>
                                                            <Input
                                                                id={`name-${index}`}
                                                                value={
                                                                    customNames[
                                                                        index
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setCustomNames(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [index]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                placeholder="Enter custom name"
                                                                className="h-8"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setUploadFiles((prev) =>
                                                            prev.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            )
                                                        );
                                                        setCustomNames(
                                                            (prev) => {
                                                                const updated =
                                                                    { ...prev };
                                                                delete updated[
                                                                    index
                                                                ];
                                                                return updated;
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={handleUpload}
                                        disabled={isUploading}
                                        className="w-full"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload {uploadFiles.length}{" "}
                                                image(s)
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                        {tempSelectedImages.length > 0 && (
                            <>
                                Selected: {tempSelectedImages.length} image
                                {tempSelectedImages.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={tempSelectedImages.length === 0}
                        >
                            Select ({tempSelectedImages.length})
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
