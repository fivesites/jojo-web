"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { optimizeCloudinaryImage } from "@/utils/cloudinary";
import { HeartIcon, HeartFilledIcon, Share2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useProducts } from "@/context/ProductContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import ProductForm from "../ProductForm";
import { useEffect, useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";

interface ProductModalProps {
  id: string;
  mode?: "view" | "edit";
}

export default function ProductModalClient({
  id,
  mode = "view",
}: ProductModalProps) {
  const router = useRouter();
  const { products, updateProduct } = useProducts();
  const {
    isInWishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();
  const { addItem: addToCart, isInCart } = useCart();

  const productId = Number(id);
  const product = products.find((p) => p.id === productId);
  const isWished = isInWishlist(productId);
  const inCart = isInCart(productId);

  // Hooks are always called
  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [description, setDescription] = useState(product?.description ?? "");
  const [imgUrl, setImgUrl] = useState(product?.img_url ?? "");
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleWishlist = () => {
    if (!product || !productId) return;
    if (isWished) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        productId,
        name: product.title || "Product",
        price: product.price || 0,
        image: product.img_url || "",
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || !productId) return;
    addToCart({
      productId,
      name: product.title || "Product",
      price: product.price || 0,
      image: product.img_url || "",
      quantity: 1,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // inside ProductModalClient
  const images = Array(4).fill(product?.img_url); // repeat the main image 4 times
  const [selectedImage, setSelectedImage] = useState(product?.img_url ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const closeModal = () => {
    router.back(); // just go back to parent route
  };

  // Guard in JSX only
  if (!product) {
    return <div className="fixed inset-0 z-40 bg-background/50" />;
  }

  const imageOptimized = imgUrl
    ? optimizeCloudinaryImage(imgUrl, {
        width: 800,
        height: 1066,
        quality: "auto",
        crop: "fill",
        gravity: "auto",
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 overflow-y-auto bg-background/80 min-h-screen w-full flex justify-start items-start "
    >
      {/* HEADER */}
      <div className="fixed top-0 z-50 left-0 w-[calc(100vw-2rem)] lg:w-[35vw] flex items-center justify-between bg-transparent lg:bg-transparent pl-1 py-1  h-10  ">
        <Button
          variant="secondary"
          size="icon"
          className="
         bg-transparent border-transparent text-secondary  
        "
          onClick={closeModal}
        >
          <Cross1Icon />
        </Button>
        <span className="flex items-baseline space-x-0 font-mono text-xs pr-1 text-secondary ">
          <Badge className="text-xs pt-1  " variant="ghost">
            {product?.category?.name}
          </Badge>
          /{" "}
          <Badge className="text-xs pt-1 d" variant="ghost">
            {product?.title}
          </Badge>
        </span>
      </div>
      <div className="relative w-[calc(100vw-2rem)] lg:w-[70vw] h-screen overflow-y-auto bg-background shadow-xl flex flex-row items-start justify-start pt-2  px-1 pb-1">
        {mode === "edit" ? (
          <ProductForm
            mode="edit"
            initialProduct={product}
            closeModal={closeModal}
          />
        ) : (
          <div className=" flex flex-col lg:flex-row items-start justify-start w-full h-full  gap-x-1 gap-y-1    pb-1 pt-[10vh] lg:pt-[20vh] lg:overflow-hidden ">
            {/* TEXT BOX */}
            <span className="grid grid-cols-2 w-full lg:w-1/2 pr-1 h-screen ">
              <div className=" flex lg:hidden flex-col justify-start items-start   w-full col-span-2 pb-1     ">
                <div className="  flex flex-row items-center justify-between w-full ">
                  <div className="flex flex-col justify-center items-start w-full">
                    <div className="flex justify-between items-baseline w-full">
                      <h1 className="text-2xl font-display text-secondary">
                        {product.title}
                      </h1>
                      <span className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleWishlist}
                        >
                          {isWished ? (
                            <HeartFilledIcon className="text-secondary" />
                          ) : (
                            <HeartIcon />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="block lg:hidden"
                        >
                          <Share2Icon />
                        </Button>
                      </span>
                    </div>
                    <h2 className="text-sm font-mono mb-2">
                      {product.price} SEK
                    </h2>
                  </div>
                </div>

                <Button
                  className="w-full  "
                  size="default"
                  onClick={handleAddToCart}
                  disabled={!product?.in_stock}
                >
                  {addedToCart
                    ? "Added to cart!"
                    : product?.in_stock
                    ? "Add to cart"
                    : "Out of stock"}
                </Button>
              </div>
              {/* IMAGES  */}
              <div
                className="
    relative
    flex flex-col
    items-start justify-start
    w-full
     overflow-y-auto
  overscroll-contain
  touch-pan-y
    gap-y-1
    col-span-2
  min-h-screen
    lg:absolute lg:right-0 lg:top-0 lg:w-1/2 lg:h-auto
  "
              >
                {/* MAIN IMAGE */}
                <div className="relative w-full aspect-3/4 h-auto ">
                  {selectedImage ? (
                    <Image
                      src={optimizeCloudinaryImage(selectedImage, {
                        width: 800,
                        height: 1066,
                        quality: "auto",
                        crop: "fill",
                        gravity: "auto",
                      })}
                      alt={title || "Product image"}
                      fill
                      className="object-cover object-top w-full"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm opacity-40">
                      NO IMAGE
                    </div>
                  )}
                </div>

                {/* THUMBNAILS */}
                <div
                  className="  flex flex-row  lg:flex-col
      
      gap-x-1            lg:gap-y-1
      overflow-x-auto
      w-full
      lg:overflow-y-auto
      lg:max-h-[40vh]
      overscroll-contain
      touch-pan-x
      lg:touch-pan-y

       "
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative h-24 aspect-square cursor-pointer border lg:h-full lg:aspect-3/4 lg:min-h-[80vh] ${
                        selectedImage === img
                          ? "border-secondary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={optimizeCloudinaryImage(img, {
                          width: 80,
                          height: 80,
                          quality: "auto",
                          crop: "fill",
                          gravity: "auto",
                        })}
                        alt={`Thumbnail ${idx}`}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* DESCRIPTION */}
              <div className="flex flex-col justify-center items-start w-full  space-y-1 border-t border-secondary p-1 h-[50vh] lg:h-auto col-span-2 lg:justify-start  lg:border-none ">
                <div className="flex justify-between items-baseline w-full">
                  <h1 className="text-2xl font-display text-secondary">
                    {product.title}
                  </h1>
                  <span className="flex items-center justify-end space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleWishlist}
                    >
                      {isWished ? (
                        <HeartFilledIcon className="text-secondary" />
                      ) : (
                        <HeartIcon />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="block lg:hidden"
                    >
                      <Share2Icon />
                    </Button>
                  </span>
                </div>
                <div className="flex items-baseline justify-center space-x-1 font-mono mb-2">
                  <h2 className="text-sm font-mono text-secondary ">
                    {product.price} SEK
                  </h2>
                  <Button className="" size="icon" variant="link">
                    {product.size?.name}
                  </Button>
                </div>
                <p className="font-serif-book text-sm text-secondary mb-4">
                  {product.description}
                </p>
                <Button
                  className="w-full  "
                  variant="secondary"
                  size="default"
                  onClick={handleAddToCart}
                  disabled={!product?.in_stock}
                >
                  {addedToCart
                    ? "Added to cart!"
                    : product?.in_stock
                    ? "Add to cart"
                    : "Out of stock"}
                </Button>
              </div>
              {/* LINKS SHIPPING INFO */}
              <div className="flex flex-row space-x-1 justify-start items-start w-full space-y-1 mt-[10vh] lg:mt-0 border-t border-t-secondary  p-1 lg:col-start-1 lg:col-span-2 lg:flex-col ">
                <Button
                  className="font-display w-min"
                  size="sm"
                  variant="outline"
                >
                  Shipping & Returns
                </Button>
                <Button
                  className="font-display w-min"
                  size="sm"
                  variant="outline"
                >
                  Terms & Conditions
                </Button>
              </div>
              {/* RELATED ITEMS */}
              <div className="flex flex-col justify-start items-start w-full space-y-1 mt-[10vh] lg:mt-0 border-t border-t-secondary  pt-1 px-1 pb-12 lg:col-start-1   ">
                <h3 className="font-display text-secondary text-base">
                  Related items
                </h3>
                <div className="grid grid-cols-4 gap-x-1 overflow-x-auto w-full">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative col-span-1 aspect-square cursor-pointer border ${
                        selectedImage === img
                          ? "border-secondary"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={optimizeCloudinaryImage(img, {
                          width: 80,
                          height: 80,
                          quality: "auto",
                          crop: "fill",
                          gravity: "auto",
                        })}
                        alt={`Thumbnail ${idx}`}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
