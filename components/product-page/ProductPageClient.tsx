"use client";

import { useSite } from "@/app/context/SiteContext";
import ProductsGrid from "./ProductsGrid";
import SiteSelector from "../SiteSelector";
import { CreateProductRequest } from "@/types/product";
import Hero from "../Hero";

export default function ProductPageClient({
  products,
}: {
  products: CreateProductRequest[];
}) {
  const { currentSite } = useSite();

  return (
    <div className={`min-h-screen`}>
      <SiteSelector />

      <ProductsGrid products={products} />
    </div>
  );
}
