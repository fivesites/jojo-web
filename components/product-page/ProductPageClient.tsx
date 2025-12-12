"use client";

import { useSite } from "@/app/context/SiteContext";
import ProductsGrid from "./ProductsGrid";
import SiteSelector from "../SiteSelector";
import { CreateProductRequest } from "@/types/product";

export default function ProductPageClient({
  products,
}: {
  products: CreateProductRequest[];
}) {
  const { currentSite } = useSite();

  return (
    <div className={`min-h-screen`}>
      {currentSite === "neutral" ? <SiteSelector /> : null}

      <ProductsGrid products={products} />
    </div>
  );
}
