"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ImageUploadMultiple from "@/components/ImageUploadMultiple";
import TagSelect from "@/components/TagSelect";
import MeasurementFields from "@/components/MeasurementFields";
import type {
  Category,
  Tag,
  Size,
  Article,
  ProductMeasurements,
} from "@/types/database";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Article;
}

export default function ProductForm({
  mode,
  initialProduct,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [orderedImageUrls, setOrderedImageUrls] = useState<string[]>([]);

  // Fetched data from database
  const [genders, setGenders] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState({
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price?.toString() || "",
    category_id: initialProduct?.category_id?.toString() || "",
    tag_id: initialProduct?.tag_id?.toString() || "",
    size_id: initialProduct?.size_id?.toString() || "",
    in_stock: initialProduct?.in_stock ?? true,
    for_sale: initialProduct?.for_sale ?? true,
  });

  const [measurements, setMeasurements] = useState<ProductMeasurements | null>(
    initialProduct?.measurements || null
  );

  // Fetch categories, tags, and sizes on mount
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch top-level categories (genders)
      const { data: genderData } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("name");

      if (genderData) setGenders(genderData);

      // Fetch tags
      const { data: tagData } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (tagData) setTags(tagData);

      // Fetch sizes
      const { data: sizeData } = await supabase
        .from("sizes")
        .select("*")
        .order("sort_order");

      if (sizeData) setSizes(sizeData);

      // If editing, fetch the parent category (gender) for the product's category
      if (mode === "edit" && initialProduct) {
        // Fetch category data if available
        if (initialProduct.category_id) {
          const { data: categoryData } = await supabase
            .from("categories")
            .select("*")
            .eq("id", initialProduct.category_id)
            .single();

          if (categoryData) {
            setSelectedCategoryName(categoryData.name);
            if (categoryData.parent_id) {
              setSelectedGender(categoryData.parent_id.toString());
            }
          }
        }

        // Fetch existing images (always, regardless of category)
        const { data: imagesData } = await supabase
          .from("product_images")
          .select("*")
          .eq("article_id", initialProduct.id)
          .order("display_order");

        if (imagesData && imagesData.length > 0) {
          const urls = imagesData.map((img) => img.image_url);
          setExistingImageUrls(urls);
        } else if (initialProduct.img_url) {
          // Fallback to old single image
          setExistingImageUrls([initialProduct.img_url]);
        }
      }
    };

    fetchData();
  }, [mode, initialProduct]);

  // Fetch subcategories when gender changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedGender) {
        setCategories([]);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", selectedGender)
        .order("name");

      if (data) setCategories(data);
    };

    fetchSubcategories();
  }, [selectedGender]);

  const handleTagCreated = (newTag: Tag) => {
    // Add new tag to the tags list
    setTags((prev) =>
      [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    // Reset category when gender changes
    setFormData((prev) => ({
      ...prev,
      category_id: "",
    }));
    setSelectedCategoryName(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
    }));

    // Find and set the category name
    const category = categories.find((cat) => cat.id.toString() === categoryId);
    setSelectedCategoryName(category?.name || null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Get signature from our API
      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
      });

      if (!signResponse.ok) {
        throw new Error("Failed to get upload signature");
      }

      const { signature, timestamp, cloudName, apiKey, folder } =
        await signResponse.json();

      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("folder", folder);

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload to Cloudinary failed");
      }

      const data = await uploadResponse.json();

      // Return the secure URL
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Upload all new images to Cloudinary
      const uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const uploadedUrl = await uploadImage(file);
          if (!uploadedUrl) {
            throw new Error("Failed to upload one or more images");
          }
          uploadedUrls.push(uploadedUrl);
        }
      }

      // Determine the primary image URL
      let firstImageUrl: string | null = null;

      if (orderedImageUrls.length > 0) {
        // Use the first image from the reordered list (works for both create and edit)
        const firstOrderedUrl = orderedImageUrls[0];

        // If it's a blob URL (new image), replace with uploaded URL
        if (firstOrderedUrl.startsWith("blob:")) {
          const blobIndex = orderedImageUrls
            .filter((u) => u.startsWith("blob:"))
            .indexOf(firstOrderedUrl);
          firstImageUrl = uploadedUrls[blobIndex] || null;
        } else {
          // It's an existing image URL (only in edit mode)
          firstImageUrl = firstOrderedUrl;
        }
      } else if (uploadedUrls.length > 0) {
        // Fallback: use first uploaded image
        firstImageUrl = uploadedUrls[0];
      } else if (existingImageUrls.length > 0) {
        // Fallback: use first existing image
        firstImageUrl = existingImageUrls[0];
      }

      const productData: any = {
        title: formData.title || null,
        description: formData.description || null,
        price: formData.price ? parseInt(formData.price) : null,
        in_stock: formData.in_stock,
        for_sale: formData.for_sale,
        img_url: firstImageUrl,
        measurements: measurements || {},
      };

      // Only include foreign key fields if they have values
      if (formData.category_id)
        productData.category_id = parseInt(formData.category_id);
      if (formData.tag_id) productData.tag_id = parseInt(formData.tag_id);
      if (formData.size_id) productData.size_id = parseInt(formData.size_id);

      let productId: number;

      if (mode === "create") {
        // Create new product
        const { data: newProduct, error: insertError } = await supabase
          .from("article")
          .insert([productData])
          .select()
          .single();

        if (insertError || !newProduct) {
          throw insertError || new Error("Failed to create product");
        }

        productId = newProduct.id;

        // Save images to product_images table
        if (orderedImageUrls.length > 0) {
          // Build final ordered list: replace blob URLs with uploaded URLs
          const finalOrderedUrls = orderedImageUrls.map((url) => {
            // If it's a blob URL (new image), find the corresponding uploaded URL
            if (url.startsWith("blob:")) {
              const index = orderedImageUrls
                .filter((u) => u.startsWith("blob:"))
                .indexOf(url);
              return uploadedUrls[index] || url;
            }
            return url;
          });

          const imageRecords = finalOrderedUrls.map((url, index) => ({
            article_id: productId,
            image_url: url,
            display_order: index,
            is_primary: index === 0,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRecords);

          if (imagesError) {
            console.error("Failed to save images:", imagesError);
            // Don't fail the whole operation, just log
          }
        } else if (uploadedUrls.length > 0) {
          // Fallback: if no ordered list, just save uploaded URLs in order
          const imageRecords = uploadedUrls.map((url, index) => ({
            article_id: productId,
            image_url: url,
            display_order: index,
            is_primary: index === 0,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRecords);

          if (imagesError) {
            console.error("Failed to save images:", imagesError);
          }
        }

        router.push("/admin/products");
      } else {
        // Update existing product
        productId = initialProduct!.id!;

        const { error: updateError } = await supabase
          .from("article")
          .update(productData)
          .eq("id", productId);

        if (updateError) {
          throw updateError;
        }

        // Handle image order updates
        if (orderedImageUrls.length > 0) {
          // Build final ordered list: replace preview URLs with uploaded URLs
          const finalOrderedUrls = orderedImageUrls.map((url) => {
            // If it's a blob URL (preview), find the corresponding uploaded URL
            if (url.startsWith("blob:")) {
              const index = orderedImageUrls
                .filter((u) => u.startsWith("blob:"))
                .indexOf(url);
              return uploadedUrls[index] || url;
            }
            return url;
          });

          // Delete all existing images for this product
          const { error: deleteError } = await supabase
            .from("product_images")
            .delete()
            .eq("article_id", productId);

          if (deleteError) {
            console.error("Failed to delete old images:", deleteError);
          }

          // Insert all images with new order
          const imageRecords = finalOrderedUrls.map((url, index) => ({
            article_id: productId,
            image_url: url,
            display_order: index,
            is_primary: index === 0,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imageRecords);

          if (imagesError) {
            console.error("Failed to save images:", imagesError);
          }
        }

        router.push(`/admin/products/${productId}`);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form
      className="absolute top-0 left-0 z-30 bg-background w-full h-full"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="mb-6 border border-red-600 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      <div className="mt-[20vh] grid grid-cols-1 lg:grid-cols-4 gap-12 px-3 bg-background">
        {/* Photo Section */}
        <h1 className="col-start-1 font-serif-display text-2xl">Add Product</h1>
        <div className="col-start-1 col-span-2">
          <ImageUploadMultiple
            onImagesChange={setImageFiles}
            onOrderChange={setOrderedImageUrls}
            existingImages={existingImageUrls}
            maxImages={8}
          />
        </div>

        {/* Form Section */}
        <div className="col-start-1 lg:col-start-3 col-span-1 lg:col-span-2 space-y-3  w-full">
          <div>
            <Label className=" ">Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full"
              placeholder="Vintage Leather Jacket"
            />
          </div>

          <div>
            <Label className=" ">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-black focus:outline-none resize-none"
              placeholder="About the article..."
            />
          </div>

          <div>
            <Label className="">PRICE (SEK)</Label>
            <Input
              type="number"
              name="price"
              step="1"
              min="0"
              pattern="[0-9]*"
              value={formData.price}
              onChange={handleChange}
              className=""
              placeholder="299"
            />
          </div>

          <div>
            <Label>GENDER</Label>

            <Select value={selectedGender} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem
                    value={gender.id.toString()} // ✅ REQUIRED
                  >
                    {gender.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-60">CATEGORY</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleCategoryChange}
              disabled={!selectedGender}
              className="w-full px-4 py-3 border border-black focus:outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="">TAG</Label>
            <TagSelect
              tags={tags}
              selectedTagId={formData.tag_id}
              onChange={(tagId) =>
                setFormData((prev) => ({ ...prev, tag_id: tagId }))
              }
              onTagCreated={handleTagCreated}
            />
          </div>
          <div>
            <Label className="block text-sm mb-2 opacity-60">SIZE</Label>

            <Select
              value={formData.size_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, size_id: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>

              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            {/* In Stock Checkbox */}
            <Label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="w-4 h-4 border border-black"
              />
              <span className="text-sm">IN STOCK</span>
            </Label>

            {/* Listing Type: Sale or Rent */}
            <div>
              <Label className="block text-sm mb-3 opacity-60">
                LISTING TYPE
              </Label>
              <div className="space-y-2">
                <Label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="for_sale"
                    checked={formData.for_sale === true}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, for_sale: true }))
                    }
                    className="w-4 h-4 border border-black"
                  />
                  <span className="text-sm">Till salu (For Sale)</span>
                </Label>
                <Label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="for_sale"
                    checked={formData.for_sale === false}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, for_sale: false }))
                    }
                    className="w-4 h-4 border border-black"
                  />
                  <span className="text-sm">Uthyrning (For Rent)</span>
                </Label>
              </div>
            </div>
          </div>

          {/* Measurements Section */}
          <MeasurementFields
            categoryName={selectedCategoryName}
            measurements={measurements}
            onChange={setMeasurements}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? mode === "create"
                ? "CREATING..."
                : "SAVING..."
              : mode === "create"
              ? "CREATE PRODUCT"
              : "SAVE CHANGES"}
          </Button>
        </div>
      </div>
    </form>
  );
}
