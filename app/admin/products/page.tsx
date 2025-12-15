import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/product";
import AdminHeaderNav from "@/components/AdminHeaderNav";
import ProductCard from "@/components/product-page/ProductCard";

export default async function ProductsPage() {
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

  return (
    <div className="min-h-screen mt-8">
      {/* Header */}
      <AdminHeaderNav />
      {/* Main Content */}
      <div className=" px-3 ">
        <h1 className="text-4xl mb-6 font-serif-display pt-6 px-6">Products</h1>

        {!products || products.length === 0 ? (
          <div className="text-center py-12 opacity-60">
            <p>No products yet</p>
            <Link
              href="/admin/products/add"
              className="inline-block mt-4 border-b border-black hover:opacity-50"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
