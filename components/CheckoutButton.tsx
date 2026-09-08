"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { product } from "@/lib/product";

type CheckoutButtonProps = {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  label?: string;
  variant?: "dark" | "light";
};

export function CheckoutButton({
  quantity,
  selectedSize = product.sizes[1],
  selectedColor = product.colors[0].name,
  label = "Order Now",
  variant = "dark",
}: CheckoutButtonProps) {
  const total = product.offerPrice * quantity;
  const params = new URLSearchParams({
    productName: product.name,
    quantity: String(quantity),
    pricePerPiece: String(product.offerPrice),
    totalPrice: String(total),
    selectedSize,
    selectedColor,
  });
  const eventPayload = {
    content_ids: [product.name],
    content_name: product.name,
    content_type: "product",
    currency: product.currency,
    value: total,
    num_items: quantity,
    selected_size: selectedSize,
    selected_color: selectedColor,
  };

  return (
    <Link
      href={`/checkout?${params.toString()}`}
      onClick={() => {
        trackMetaPixelEvent("AddToCart", eventPayload);
      }}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded px-6 py-3 text-sm font-bold transition ${
        variant === "dark"
          ? "bg-espresso text-white hover:bg-leather"
          : "bg-white text-espresso hover:bg-linen"
      }`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
