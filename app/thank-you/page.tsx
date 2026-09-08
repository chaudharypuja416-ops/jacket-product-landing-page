"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { formatMoney, product } from "@/lib/product";

function ThankYouContent() {
  const params = useSearchParams();
  const productName = params.get("productName") || product.name;
  const quantity = Number(params.get("quantity") || 1);
  const totalPrice = Number(params.get("totalPrice") || product.offerPrice);
  const orderId = params.get("orderId");
  const selectedSize = params.get("selectedSize");
  const selectedColor = params.get("selectedColor");
  const trackedPurchaseRef = useRef(false);

  useEffect(() => {
    if (trackedPurchaseRef.current || !orderId) return;

    trackedPurchaseRef.current = true;
    trackMetaPixelEvent(
      "Purchase",
      {
        content_ids: [productName],
        content_name: productName,
        content_type: "product",
        currency: product.currency,
        value: totalPrice,
        num_items: quantity,
        selected_size: selectedSize || undefined,
        selected_color: selectedColor || undefined,
      },
      { eventID: orderId },
    );
  }, [orderId, productName, quantity, selectedColor, selectedSize, totalPrice]);

  return (
    <main className="grain min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Logo />
        <section className="mt-10 rounded bg-white p-7 text-center shadow-premium sm:p-12">
          <CheckCircle2 className="mx-auto h-16 w-16 text-cognac" />
          <h1 className="mt-5 font-serif text-4xl font-black text-espresso sm:text-5xl">
            Thank you for your order!
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-espresso/68">
            Our sales representative will call you soon to confirm your order.
          </p>
          <div className="mx-auto mt-8 max-w-xl rounded border border-espresso/10 bg-linen p-5 text-left">
            {orderId && (
              <div className="flex justify-between gap-4 py-3">
                <span className="text-espresso/65">Order ID</span>
                <strong className="text-right text-espresso">{orderId}</strong>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
              <span className="text-espresso/65">Product ordered</span>
              <strong className="text-right text-espresso">{productName}</strong>
            </div>
            <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
              <span className="text-espresso/65">Quantity</span>
              <strong className="text-espresso">{quantity}</strong>
            </div>
            {selectedSize && (
              <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
                <span className="text-espresso/65">Size</span>
                <strong className="text-espresso">{selectedSize}</strong>
              </div>
            )}
            {selectedColor && (
              <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
                <span className="text-espresso/65">Color</span>
                <strong className="text-espresso">{selectedColor}</strong>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
              <span className="text-espresso/65">Total price</span>
              <strong className="text-espresso">{formatMoney(totalPrice)}</strong>
            </div>
            <div className="flex justify-between gap-4 border-t border-espresso/10 py-3">
              <span className="text-espresso/65">Payment method</span>
              <strong className="text-right text-espresso">Cash On Delivery</strong>
            </div>
          </div>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded bg-espresso px-6 py-3 font-black text-white transition hover:bg-leather"
          >
            Back to Home
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">Loading order...</main>}>
      <ThankYouContent />
    </Suspense>
  );
}
