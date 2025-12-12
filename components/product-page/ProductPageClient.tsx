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
      <section className={`${currentSite === "neutral" ? "mt-0" : "mt-8"}`}>
        {currentSite === "neutral" ? <SiteSelector /> : null}
      </section>
      <ProductsGrid products={products} />
    </div>
  );
}
