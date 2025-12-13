"use client";

import { useSite } from "@/app/context/SiteContext";
import ProductsGrid from "./ProductsGrid";
import SiteSelector from "../SiteSelector";

export default function ProductPageClient({}: {}) {
  const { currentSite } = useSite();

  return (
    <div className={`min-h-screen bg-background `}>
      <section
        className={`${currentSite === "neutral" ? "px-0" : "px-3 "}  mt-8`}
      >
        <SiteSelector />
      </section>

      {currentSite === "neutral" ? null : <ProductsGrid />}
    </div>
  );
}
