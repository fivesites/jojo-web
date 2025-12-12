import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/types/product";
import AdminHeaderNav from "@/components/AdminHeaderNav";

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
      <div className="max-w-7xl mx-auto px-3 ">
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
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group"
              >
                {product.img_url ? (
                  <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                    <img
                      src={product.img_url}
                      alt={product.title || "Product image"}
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gray-100 mb-3 flex items-center justify-center">
                    <span className="text-sm opacity-40">No image</span>
                  </div>
                )}
                <div className="text-sm space-y-1">
                  <div className="font-medium">{product.title}</div>
                  <div className="opacity-60">{product.price} kr</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.category && (
                      <span className="text-xs border border-black px-2 py-0.5">
                        {product.category.name}
                      </span>
                    )}
                    {product.size && (
                      <span className="text-xs border border-black px-2 py-0.5">
                        {product.size.name}
                      </span>
                    )}
                    {product.tag && (
                      <span className="text-xs border border-black px-2 py-0.5 opacity-60">
                        {product.tag.name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
