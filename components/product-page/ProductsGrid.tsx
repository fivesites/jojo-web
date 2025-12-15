"use client";

import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { Button, type buttonVariants } from "../ui/button";
import type { VariantProps } from "class-variance-authority";
import { useSite } from "@/app/context/SiteContext";
import { useProducts } from "@/context/ProductContext";
import { motion, type Variants } from "framer-motion";

import LoaderGIF from "../LoaderGIF";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

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

export default function ProductsGrid({}: {}) {
  const { currentSite } = useSite();
  const { products: allProducts, loading, error } = useProducts();

  // Filter products based on current site (sale or rent)
  const products = allProducts.filter((product) => {
    if (currentSite === "sale") {
      return product.for_sale === true;
    } else {
      return product.for_sale === false;
    }
  });

  const [layoutIndex, setLayoutIndex] = useState<number>(2);

  const layouts = [
    "grid-cols-4 lg:grid-cols-8 grid-rows-auto",
    "grid-cols-2 lg:grid-cols-6 grid-rows-auto",
    "grid-cols-1 lg:grid-cols-4 grid-rows-auto",
  ];

  if (loading) {
    return <LoaderGIF />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-sm opacity-60">
          No products available{" "}
          {currentSite === "sale" ? "for sale" : "for rent"}
        </div>
      </div>
    );
  }

  return (
    <div className="relative  ">
      <div className="sticky  top-[10vh] lg:top-[20vh] z-40 bg-background  shadow w-full">
        <div className="flex justify-between items-start font-mono text-xs gap-3 w-full px-3">
          <span className="flex items-start font-mono text-xs gap-3">
            <Button size="sm" variant="link">
              FILTER
            </Button>
            <Button size="sm" variant="link">
              Latest Added <span>[x]</span>
            </Button>
          </span>
          <ToggleGridColsButton
            layouts={layouts}
            layoutIndex={layoutIndex}
            setLayoutIndex={setLayoutIndex}
            buttonText="[+/-]"
            variant="link"
            size="sm"
          />
        </div>
      </div>

      <motion.div
        key={`${currentSite}-${layoutIndex}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={` grid  ${layouts[layoutIndex]} gap-3 relative px-3 mt-[10vh] lg:mt-[20vh]`}
      >
        {products.map((product, index) => (
          <motion.div
            className="relative z-10 "
            key={product.id}
            variants={cardVariants}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}

        <div className="absolute left-1/2 top-0 h-full w-px bg-foreground transform -translate-x-1/2 z-0" />
      </motion.div>
    </div>
  );
}
