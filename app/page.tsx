import HeaderNav from "@/components/HeaderNav";
import ProductsGrid from "@/components/ProductsGrid";

export default async function Home() {
  return (
    <main className="min-h-screen ">
      <HeaderNav />
      <section className="">
        <ProductsGrid />
      </section>
      <section className="h-screen"></section>
    </main>
  );
}
