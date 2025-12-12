"use client";

import { useRouter } from "next/navigation";

interface ProductModalProps {
  params: { id: string };
}

export default function ProductModal({ params }: ProductModalProps) {
  const router = useRouter();

  const close = () => router.back();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* blurred background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={close}
      />

      {/* modal box */}
      <div className="relative z-50 w-1/2 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl">
        <button
          onClick={close}
          className="absolute right-4 top-4 text-xl opacity-60 hover:opacity-100"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold">Product {params.id}</h1>

        <p>More product details…</p>
      </div>
    </div>
  );
}
