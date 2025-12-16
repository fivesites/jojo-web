// app/admin/@modal/(.)product/[id]/page.tsx
import AdminEditProductModal from "@/components/AdminEditProductModal";

export default function AdminProductModal({
  params,
}: {
  params: { id: string };
}) {
  return <AdminEditProductModal id={params.id} />;
}
