// app/admin/@modal/(.)product/[id]/page.tsx
import AdminEditProductModal from "@/components/AdminEditProductModal";

export default async function AdminProductModal({
  params: { id },
}: {
  params: { id: string };
}) {
  return <AdminEditProductModal params={Promise.resolve({ id })} />;
}
