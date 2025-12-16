"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductContext";
import Image from "next/image";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import { motion } from "framer-motion";
import { HeartIcon, Share2Icon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProductModalProps {
  id: string;
  mode?: "view" | "edit";
}

export default function ProductModalClient({
  id,
  mode = "view",
}: ProductModalProps) {
  const router = useRouter();
  const { products, updateProduct } = useProducts();

  const productId = Number(id);
  const product = products.find((p) => p.id === productId);

  // Editable states
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [description, setDescription] = useState(product?.description ?? "");
  const [imgUrl, setImgUrl] = useState(product?.img_url ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const handleSave = async () => {
    if (!product) return;

    const updatedProduct = {
      ...product,
      title,
      price,
      description,
      img_url: imgUrl,
    };

    updateProduct(updatedProduct);
    router.back();
  };

  const imageOptimized = imgUrl
    ? optimizeCloudinaryImage(imgUrl, {
        width: 800,
        height: 1066,
        quality: "auto",
        crop: "fill",
        gravity: "auto",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.back()}
      className="fixed inset-0 z-40 grid grid-cols-12 items-start justify-center overflow-y-auto shadow-2xl min-h-screen w-full"
    >
      <div
        className="absolute inset-0 bg-background/50 w-full z-0 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      />

      <div
        className="col-start-2 col-span-11 relative z-40 mx-0 shadow-xl overflow-y-auto flex flex-col lg:flex-row items-center justify-center bg-background h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="link"
          size="sm"
          onClick={() => router.back()}
          className="absolute z-60 top-[10vh] lg:top-[20vh] left-0"
        >
          Close [x]
        </Button>

        {/* TEXT CONTAINER */}
        <div className="flex flex-col items-start justify-center w-full h-full px-3 pt-12 space-y-3">
          {mode === "edit" ? (
            <>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
              />
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Price"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <Input
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="Image URL"
              />

              <div className="flex flex-row gap-2 mt-4">
                <Button size="lg" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-sm font-normal">
                {product?.title ?? "Untitled"}
              </h1>
              <p className="mb-2">{product?.price ?? "300"} SEK</p>
              <p className="mb-2">{product?.description ?? "No description"}</p>
            </>
          )}

          <div className="flex flex-col justify-center items-center mt-4 gap-2">
            <Button variant="ghost" size="icon">
              <HeartIcon />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2Icon />
            </Button>
          </div>
        </div>

        {/* IMAGE CONTAINER */}
        <div className="flex flex-col overflow-y-scroll w-full h-full">
          <div className="relative w-full aspect-3/4 h-auto">
            {imageOptimized ? (
              <Image
                src={imageOptimized}
                alt={title}
                fill
                className="object-cover object-top w-full"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm opacity-40">
                NO IMAGE
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
