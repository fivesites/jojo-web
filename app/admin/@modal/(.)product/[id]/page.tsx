// app/admin/@modal/(.)product/[id]/page.tsx
import ProductModalClient from "@/components/product-page/ProductModalClient";

export default async function AdminProductModal({
  params: { id },
}: {
  params: { id: string };
}) {
  return <ProductModalClient mode="edit" id={id} />;
}
