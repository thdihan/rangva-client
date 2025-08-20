"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface ProductTagsProps {
    selectedTags: string[];
    newTag: string;
    onNewTagChange: (tag: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
}

export default function ProductTags({
    selectedTags,
    newTag,
    onNewTagChange,
    onAddTag,
    onRemoveTag,
}: ProductTagsProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onAddTag();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={newTag}
                        onChange={(e) => onNewTagChange(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={handleKeyPress}
                    />
                    <Button type="button" variant="outline" onClick={onAddTag}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {tag}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => onRemoveTag(tag)}
                            />
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
