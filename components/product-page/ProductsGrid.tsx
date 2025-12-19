"use client";

import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { Button, type buttonVariants } from "../ui/button";
import type { VariantProps } from "class-variance-authority";
import { useSite } from "@/context/SiteContext";
import { useProducts } from "@/context/ProductContext";
import { Fragment } from "react";
import ProductInlinePanel from "./ProductInlinePanel";
import { motion, type Variants, LayoutGroup } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Badge } from "../ui/badge";
import LoaderJoJo from "../LoaderJoJo";
import { Input } from "../ui/input";

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
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const inlinePanelRef = useRef<HTMLDivElement | null>(null);

  // Filter products based on current site (sale or rent)
  const products = allProducts.filter((product) => {
    if (currentSite === "sale") {
      return product.for_sale === true;
    } else {
      return product.for_sale === false;
    }
  });

  useEffect(() => {
    if (activeProduct && inlinePanelRef.current) {
      inlinePanelRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeProduct]);

  const [layoutIndex, setLayoutIndex] = useState<number>(1);
  const [showText, setShowText] = useState(false);

  const handleShowText = () => {
    setShowText((prev) => !prev);
  };

  const layouts = [
    "grid-cols-4 lg:grid-cols-8 grid-rows-auto   auto-rows-fr",
    "grid-cols-2 lg:grid-cols-6 grid-rows-auto auto-rows-fr",
    "grid-cols-1 lg:grid-cols-4 grid-rows-auto auto-rows-fr",
  ];

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/products/")) {
      setActiveProduct(null);
    }
  }, [pathname]);

  if (loading) {
    return <LoaderJoJo loading={loading} />;
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
    <>
      <LayoutGroup>
        <div
          className={` ${
            currentSite === "sale" ? "bg-background" : "bg-background"
          } relative w-full overflow-visible jojo-main-wrapper-top  `}
        >
          <LoaderJoJo loading={loading} />
          {/* Sticky header outside the motion/grid */}

          <div className="sticky top-1 z-20   w-full py-1 bg-background px-1  ">
            <div className=" grid grid-cols-4 items-baseline  gap-1 w-full  ">
              <div className="flex justify-between w-full col-span-4">
                <span className="flex justify-start space-x-1">
                  <Button
                    size="icon"
                    variant={showText ? "secondary" : "outline"}
                    onClick={handleShowText}
                    className=""
                  >
                    T
                  </Button>
                  <Button variant="secondary" size="sm">
                    FILTER PRODUCTS
                  </Button>
                  <Badge className=" " variant="outline">
                    Show All
                  </Badge>
                </span>
                <Input
                  className=" px-2 h-6 ml-1 placeholder:text-xs w-full bg-background border-l-secondary"
                  placeholder="Search Products..."
                />
              </div>
            </div>
          </div>
          <motion.div
            key={`${currentSite}-${layoutIndex}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={` grid  ${
              layouts[layoutIndex]
            } gap-x-1.5 gap-y-1.5 relative  pb-1 px-1 ${
              currentSite === "sale" ? "bg-background" : "bg-background"
            }  `}
          >
            {products.map((product) => (
              <Fragment key={product.id}>
                <motion.div
                  layout
                  layoutId={`product-${product.id}`} // Ensure product.id is always a number
                  onClick={() => setActiveProduct(Number(product.id))}
                >
                  <ProductCard
                    showText={showText}
                    setShowText={setShowText}
                    key={product.id}
                    product={product}
                  />
                </motion.div>

                {activeProduct === product.id && (
                  <ProductInlinePanel
                    ref={inlinePanelRef}
                    product={product}
                    mode="view"
                    onClose={() => setActiveProduct(null)}
                  />
                )}
              </Fragment>
            ))}

            {/* <div className="absolute left-1/2 top-0 h-full w-px bg-foreground transform -translate-x-1/2 z-0" /> */}
          </motion.div>
        </div>
      </LayoutGroup>
    </>
  );
}
