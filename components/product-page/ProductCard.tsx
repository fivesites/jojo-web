import { Card, CardContent, CardDescription } from "../ui/card";
import Image from "next/image";
import { CreateProductRequest } from "@/types/product";
export default function ProductCard({
  product,
}: {
  product: CreateProductRequest;
}) {
  const productPrice = `${product.price} SEK`;

  return (
    <Card className={`w-full `}>
      <CardContent className="p-0">
        <div className={`relative w-full `}>
          <Image
            src={product.img_url || "/placeholder.png"}
            alt={product.title || "Product image"}
            fill
            className="object-cover object-top"
          />
        </div>
      </CardContent>
      <CardDescription className="py-3 px-1.5 space-y-1.5">
        <h3 className="font-bold truncate w-2/3">{product.title}</h3>
        <h4 className="flex w-full justify-between items-baseline font-mono ">
          {productPrice}
        </h4>
      </CardDescription>
    </Card>
  );
}
