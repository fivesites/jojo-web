"use client";

import { useState } from "react";
import type { Tag } from "@/types/database";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

interface TagSelectProps {
  tags: Tag[];
  selectedTagId: string;
  onChange: (tagId: string) => void;
  onTagCreated: (newTag: Tag) => void;
}

export default function TagSelect({
  tags,
  selectedTagId,
  onChange,
  onTagCreated,
}: TagSelectProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create tag");
      }

      const newTag: Tag = await response.json();

      onTagCreated(newTag);
      onChange(newTag.id.toString());

      setShowCreateModal(false);
      setNewTagName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === "__create_new__") {
      setShowCreateModal(true);
      return;
    }

    onChange(value);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewTagName("");
    setError(null);
  };

  return (
    <>
      {/* Tag Select */}
      <Select value={selectedTagId} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full px-4 py-3 border border-black bg-white">
          <SelectValue placeholder="Select tag" />
        </SelectTrigger>

        <SelectContent>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id.toString()}>
              {tag.name}
            </SelectItem>
          ))}

          <SelectItem value="__create_new__" className="font-medium">
            + Skapa ny tagg
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Create Tag Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white border-2 border-black max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-black px-6 py-4 flex justify-between">
              <h2 className="text-lg tracking-tight">Skapa ny tagg</h2>
              <Button onClick={handleCloseModal} className="">
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {error && (
                <div className="mb-4 border border-red-600 px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Label className="">TAG NAME</Label>
              <Input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                className="w-full px-4 py-3 border border-black focus:outline-none"
                placeholder="Vintage, Y2K, etc."
                autoFocus
                disabled={isCreating}
              />

              <p className="text-xs opacity-60 mt-2">
                Exempel: Vintage, Sommar, Y2K
              </p>
            </div>

            {/* Actions */}
            <div className="border-t border-black px-6 py-4 flex gap-3 justify-end">
              <Button
                onClick={handleCloseModal}
                disabled={isCreating}
                className=""
              >
                Avbryt
              </Button>
              <Button
                onClick={handleCreateTag}
                disabled={isCreating || !newTagName.trim()}
                className=""
              >
                {isCreating ? "Skapar..." : "Skapa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
