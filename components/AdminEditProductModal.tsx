"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import ProductForm from "@/components/ProductForm";
import type { Article } from "@/types/database";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function AdminEditProductModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setProductId(resolvedParams.id);
    };
    init();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const supabase = createClient();

      // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Fetch product
      const { data, error: fetchError } = await supabase
        .from("article")
        .select(
          `
          *,
          category:categories!fk_article_category(id, name, slug, parent_id),
          tag:tags!fk_article_tag(id, name, slug),
          size:sizes!fk_article_size(id, name, slug)
        `
        )
        .eq("id", productId)
        .single();

      if (fetchError || !data) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Header */}

      <div className="flex items-center gap-6">
        <Button onClick={() => router.back()}>Close</Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl mb-8 tracking-tight">EDIT PRODUCT</h1>
        <ProductForm mode="edit" initialProduct={product || undefined} />
      </div>
    </div>
  );
}
