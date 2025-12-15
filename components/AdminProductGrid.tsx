"use client";

import Link from "next/link";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import type { Product } from "@/types/product";
import ProductCard from "./product-page/ProductCard";
import { useState } from "react";
import ProductForm from "@/components/ProductForm";

interface ProductGridProps {
  products: Product[];
}

export default function AdminProductClient({ products }: ProductGridProps) {
  const [openFormm, setOpenForm] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpenForm(true)}
        className="flex text-2xl font-serif-display gap-x-3"
      >
        Add new [+]
      </button>
      <ProductForm mode="create" />
      <div className="grid grid-cols-1  lg:grid-cols-6 gap-3">
        {products.map((product) => {
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
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group cursor-pointer"
            >
              <ProductCard product={product} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
