"use client";

import Link from "next/link";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import type { Product } from "@/types/product";
import ProductCard from "./product-page/ProductCard";
import { useState } from "react";
import ProductForm from "@/components/ProductForm";
import { Button, type buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import { motion, type Variants } from "framer-motion";

interface ProductGridProps {
  products: Product[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // shorter delay between each card
      delayChildren: 0.2, // initial delay before first card
    },
  },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // slide in from left + fade
  visible: {
    opacity: 1,

    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function ToggleGridColsButton({
  buttonText,
  size = "sm",
  variant = "link",
  layouts,
  setLayoutIndex,
}: {
  buttonText: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  layouts: string[];
  layoutIndex: number;
  setLayoutIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const toggleCols = () => {
    setLayoutIndex((prev) => (prev + 1) % layouts.length);
  };

  return (
    <Button onClick={toggleCols} size={size} variant={variant}>
      {buttonText}
    </Button>
  );
}

export default function AdminProductClient({ products }: ProductGridProps) {
  const [openForm, setOpenForm] = useState(false);
  const toggleForm = () => setOpenForm(!openForm);

  const [layoutIndex, setLayoutIndex] = useState<number>(2);

  const layouts = [
    "grid-cols-4 lg:grid-cols-8 grid-rows-auto",
    "grid-cols-2 lg:grid-cols-6 grid-rows-auto",
    "grid-cols-1 lg:grid-cols-4 grid-rows-auto",
  ];

  return (
    <div className="relative w-full space-y-3">
      {openForm && <ProductForm mode="create" />}
      <div className="sticky  top-14 left-0 right-0 z-30 bg-background  shadow w-full">
        <div className="flex justify-between items-start font-serif-book text-xs gap-3 w-full ">
          <span className="flex items-center gap-3 w-1/2">
            <Button size="sm" onClick={() => setOpenForm(true)} className="">
              Add Product
            </Button>
            <h2 className="font-serif-">Total Products [{products.length}]</h2>
          </span>
          <span className="flex items-start justify-between font-mono text-xs gap-3 w-1/2">
            <Button size="sm">Filter</Button>

            <ToggleGridColsButton
              layouts={layouts}
              layoutIndex={layoutIndex}
              setLayoutIndex={setLayoutIndex}
              buttonText="[+/-]"
              size="sm"
              variant="default"
            />
          </span>
        </div>
      </div>

      <motion.div
        key={`-${layoutIndex}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={` grid  ${layouts[layoutIndex]} gap-3 relative px-3`}
      >
        {products.map((product, index) => {
          // Optimize image URL if available
          const imageUrl = product.img_url
            ? optimizeCloudinaryImage(product.img_url, {
                width: 600,
                height: 800,
                quality: "auto",
                crop: "fill",
                gravity: "auto",
              })
            : null;

          return (
            <motion.div
              className="relative z-10 "
              key={product.id}
              variants={cardVariants}
            >
              <Link
                href={`/admin/product/${product.id}`}
                className="group cursor-pointer"
              >
                <ProductCard product={product} />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
