import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/product";

import AdminHeaderNav from "@/components/AdminHeaderNav";
import AdminProductGrid from "@/components/AdminProductGrid";
import ProductForm from "@/components/ProductForm";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Fetch products with joined category, tag, and size data
  const { data: products } = await supabase
    .from("article")
    .select(
      `
      *,
      category:categories!fk_article_category(id, name, slug, parent_id),
      tag:tags!fk_article_tag(id, name, slug),
      size:sizes!fk_article_size(id, name, slug)
    `
    )
    .order("created_at", { ascending: false });

  const totalProducts = products?.length || 0;
  return (
    <div className="min-h-screen  bg-background">
      {/* Header */}
      <AdminHeaderNav />
      {/* Main Content */}
      <div className="mt-[10vh] ] px-3 py-9 w-full flex-col space-y-6">
        <span className="flex text-2xl font-serif-display gap-x-3">
          <h3 className="  ">Total Products</h3>[{totalProducts}]
        </span>

        {!products || products.length === 0 ? null : (
          <AdminProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
