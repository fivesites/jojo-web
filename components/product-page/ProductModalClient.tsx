"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { useEffect } from "react";
import { useProducts } from "@/context/ProductContext";
import Image from "next/image";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon, Share1Icon, Share2Icon } from "@radix-ui/react-icons";

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
      className="fixed inset-0 z-40 grid grid-cols-12 items-start justify-center overflow-y-auto shadow-2xl min-h-screen w-full"
    >
      {/* Semi-transparent background */}
      <div
        className="absolute inset-0 bg-background/50 w-full z-0 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Modal content */}
      <div
        className="col-start-2 col-span-11 relative z-40  mx-0     shadow-xl  overflow-y-auto flex flex-col lg:flex-row items-center justify-center bg-background h-full w-full  "
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="link"
          size="sm"
          onClick={() => router.back()}
          className="absolute z-60 top-[10vh] lg:top-[20vh]  left-0 "
        >
          Close [x]
        </Button>
        {/* TEXT CONTAINER */}
        <div className="  flex flex-col items-start justify-center w-full h-full px-3 pt-12">
          <div className="flex flex-row w-full justify-between items-start">
            <div className="flex flex-col w-full lg:col-span-1 items-start justify-center font-serif-book  text-sm  space-y-3 h-auto ">
              <h1 className=" text-sm font-normal   ">
                {product?.title ?? "Untitled"}
              </h1>

              <p className="mb-6 ">{product?.price ?? "300"} SEK</p>

              <p className="mb-6">{product?.description ?? "No description"}</p>
            </div>
            <div className="flex flex-col justify-center items-center ">
              <Button variant="ghost" size="icon" className="">
                <HeartIcon />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2Icon />
              </Button>
            </div>
          </div>
          <Button size="lg" className="w-full">
            Add to cart
          </Button>
        </div>
        {/* IMAGES CONTAINER */}
        <div className=" flex flex-col overflow-y-scroll w-full h-full">
          <div className="relative w-full aspect-3/4 h-auto  ">
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
          <div className="relative w-full aspect-3/4 h-auto  ">
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
