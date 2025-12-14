"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { useEffect } from "react";
import { useProducts } from "@/context/ProductContext";
import Image from "next/image";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import { AnimatePresence, motion } from "framer-motion";

export default function ProductModalClient({ id }: { id: string }) {
  const router = useRouter();
  const { products } = useProducts();

  const productId = Number(id);

  const product = products.find((p) => p.id === productId);

  const imageUrl = product?.img_url
    ? optimizeCloudinaryImage(product.img_url, {
        width: 800,
        height: 1066,
        quality: "auto",
        crop: "fill",
        gravity: "auto",
      })
    : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.back()}
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto"
    >
      {/* Semi-transparent background */}
      <div
        className="absolute inset-0 bg-background/5 w-full"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Modal content */}
      <div
        className="relative z-40 mt-8 lg:mt-16 mx-0 lg:mx-48 p-6 bg-background shadow-xl max-h-[96vh] overflow-y-auto w-full "
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="link"
          size="sm"
          onClick={() => router.back()}
          className=""
        >
          Close
        </Button>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-3 items-start justify-start">
          <div className="flex flex-col w-full lg:col-span-1 items-start justify-start font-serif-book pt-4 px-3 text-sm">
            <h1 className="mb-3 lg:mb-6 text-sm lg:text-2xl lg:font-serif-display">
              {product?.title ?? "Untitled"}
            </h1>

            <p className="mb-3">{product?.description ?? "No description"}</p>
            <p className="font-mono text-xs mb-6">
              {product?.price ?? "No price"} SEK
            </p>
            <Button className="w-full">Add to cart</Button>
          </div>

          <div className="relative w-full aspect-3/4 h-auto mt-6 px-6">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product?.title ?? "Product"}
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
