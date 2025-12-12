import ProductPageClient from "@/components/product-page/ProductPageClient";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { CreateProductRequest } from "@/types/product";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch products with joined category, tag, and size data
  const { data: products } = (await supabase
    .from("article")
    .select(
      `
    *,
    category:categories!fk_article_category(id, name, slug, parent_id),
    tag:tags!fk_article_tag(id, name, slug),
    size:sizes!fk_article_size(id, name, slug)
  `
    )
    .order("created_at", { ascending: false })) as unknown as {
    data: CreateProductRequest[];
  };

  const productsData = products || [];

  return (
    <main className="">
      <ProductPageClient products={productsData} />
    </main>
  );
}
