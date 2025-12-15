import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import Image from "next/image";
import type { Product } from "@/types/product";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productPrice = `${product.price || 0} SEK`;
  const aspectClass = "aspect-[3/4]";

  // Optimize image URL if available
  const imageUrl = product.img_url
    ? optimizeCloudinaryImage(product.img_url, {
        width: 800,
        height: 1066,
        quality: "auto",
        crop: "fill",
        gravity: "auto",
      })
    : null;

  return (
    <Card className={`w-full bg-background   `}>
      <CardContent className="p-0">
        <div className={`relative w-full  ${aspectClass} `}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title || "Product"}
              fill
              className="object-cover object-top   "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm opacity-40">
              NO IMAGE
            </div>
          )}
          <span className="absolute   top-0 right-0 flex  items-start justify-start w-full">
            <div className="p-3 flex flex-wrap gap-1.5 items-end justify-end w-full">
              {product.tag && (
                <Badge variant="secondary" className=" ">
                  #{product.tag.name}
                </Badge>
              )}
            </div>
          </span>
        </div>
      </CardContent>
      <CardDescription className="flex flex-row py-3 px-1.5 w-full justify-between">
        <div className="flex-col space-y-1.5 ">
          <h3 className="font-serif-display text-sm truncate w-full">
            {product.title || "Untitled"}
          </h3>
          <h4 className="flex w-full justify-between items-baseline font-mono text-xs ">
            {productPrice}
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end items-start ">
          {" "}
          {product.category && (
            <Badge variant="secondary" className=" ">
              {product.category.name}
            </Badge>
          )}
          {product.size && (
            <Badge variant="secondary" className="">
              {product.size.name}
            </Badge>
          )}
        </div>
      </CardDescription>

      <CardFooter className="flex justify-between items-center"></CardFooter>
    </Card>
  );
}
