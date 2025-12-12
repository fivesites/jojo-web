import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import AdminHeaderNav from "@/components/AdminHeaderNav";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: products } = await supabase
    .from("article")
    .select("*")
    .order("created_at", { ascending: false });

  const totalProducts = products?.length || 0;

  return (
    <div className="min-h-screen mt-8 bg-background">
      {/* Header */}
      <AdminHeaderNav />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-2xl">
          {/* Products Count */}
          <div className=" bg-accent text-accent-foreground p-6">
            <h3 className="text-sm font-mono mb-6 ">Total products</h3>
            <div className=" font-serif-display text-6xl px-3">
              {totalProducts}
            </div>
          </div>

          {/* Add Product */}
          <Link
            href="/admin/products/add"
            className="bg-secondary text-secondary-foreground hover:text-secondary hover:bg-secondary-foreground p-6 transition-all"
          >
            <div className="text-sm font-mono mb-6   group-hover:opacity-100">
              Add new
            </div>
            <div className="font-serif-display text-6xl px-3">+</div>
          </Link>

          {/* View Products */}
          <Link
            href="/admin/products"
            className="bg-popover text-popover-foreground hover:text-popover hover:bg-popover-foreground p-6 transition-all"
          >
            <div className="text-sm  font-mono ">VIEW ALL PRODUCTS</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
