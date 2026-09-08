"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, LockKeyhole, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { formatMoney, product } from "@/lib/product";

type FieldErrors = Record<string, string[] | undefined>;

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quantity = Math.max(1, Number(searchParams.get("quantity") || "1"));
  const pricePerPiece = Number(searchParams.get("pricePerPiece") || product.offerPrice);
  const productName = searchParams.get("productName") || product.name;
  const totalPrice = Number(searchParams.get("totalPrice") || quantity * pricePerPiece);
  const selectedSize = searchParams.get("selectedSize") || product.sizes[1];
  const selectedColor = searchParams.get("selectedColor") || product.colors[0].name;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const trackedCheckoutRef = useRef(false);

  const orderSummary = useMemo(
    () => ({
      productName,
      quantity,
      pricePerPiece,
      totalPrice,
      selectedSize,
      selectedColor,
    }),
    [pricePerPiece, productName, quantity, selectedColor, selectedSize, totalPrice],
  );

  useEffect(() => {
    if (trackedCheckoutRef.current) return;

    trackedCheckoutRef.current = true;
    trackMetaPixelEvent("InitiateCheckout", {
      content_ids: [productName],
      content_name: productName,
      content_type: "product",
      currency: product.currency,
      value: totalPrice,
      num_items: quantity,
      selected_size: selectedSize,
      selected_color: selectedColor,
    });
  }, [productName, quantity, selectedColor, selectedSize, totalPrice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: String(formData.get("customerName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      location: String(formData.get("location") || ""),
      ...orderSummary,
    };

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setFieldErrors(result.errors || {});
        setError(result.message || "Order submission failed. Please try again.");
        return;
      }

      const params = new URLSearchParams({
        orderId: result.orderId,
        productName,
        quantity: String(quantity),
        totalPrice: String(totalPrice),
        selectedSize,
        selectedColor,
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch {
      setError("Unable to submit your order right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function fieldError(name: string) {
    return fieldErrors[name]?.[0];
  }

  return (
    <main className="grain min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-espresso">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
          <section className="rounded bg-white p-6 shadow-premium sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-leather">
                Cash on Delivery checkout
              </p>
              <h1 className="mt-2 font-serif text-4xl font-black text-espresso">
                Confirm your order
              </h1>
              <p className="mt-2 text-espresso/65">
                Our sales representative will call you soon after submission.
              </p>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Full Name
                  <input name="customerName" className="h-12 rounded border border-espresso/15 px-4 outline-none focus:border-cognac" required />
                  {fieldError("customerName") && <span className="text-sm text-red-600">{fieldError("customerName")}</span>}
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Phone Number
                  <input name="phone" className="h-12 rounded border border-espresso/15 px-4 outline-none focus:border-cognac" required />
                  {fieldError("phone") && <span className="text-sm text-red-600">{fieldError("phone")}</span>}
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold text-espresso">
                Email Address
                <input name="email" type="email" className="h-12 rounded border border-espresso/15 px-4 outline-none focus:border-cognac" required />
                {fieldError("email") && <span className="text-sm text-red-600">{fieldError("email")}</span>}
              </label>
              <label className="grid gap-2 text-sm font-bold text-espresso">
                Exact Location
                <textarea
                  name="location"
                  placeholder="Kindly share your exact location"
                  className="min-h-28 rounded border border-espresso/15 px-4 py-3 outline-none focus:border-cognac"
                  required
                />
                {fieldError("location") && <span className="text-sm text-red-600">{fieldError("location")}</span>}
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Product Name
                  <input value={productName} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Quantity
                  <input value={quantity} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Price Per Piece
                  <input value={formatMoney(pricePerPiece)} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Total Price
                  <input value={formatMoney(totalPrice)} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Selected Size
                  <input value={selectedSize} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-espresso">
                  Selected Color
                  <input value={selectedColor} readOnly className="h-12 rounded border border-espresso/10 bg-linen px-4 text-espresso/70" />
                </label>
              </div>

              {error && (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded bg-espresso px-6 py-4 font-black text-white transition hover:bg-leather disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Order Now
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded bg-espresso p-6 text-white shadow-premium sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-bold">
              <LockKeyhole className="h-4 w-4" />
              Secure server submission
            </div>
            <h2 className="font-serif text-3xl font-black">Order summary</h2>
            <div className="mt-6 space-y-4 text-white/78">
              <div className="flex justify-between gap-4">
                <span>Product</span>
                <strong className="text-right text-white">{productName}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Quantity</span>
                <strong className="text-white">{quantity}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Price per piece</span>
                <strong className="text-white">{formatMoney(pricePerPiece)}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Size</span>
                <strong className="text-white">{selectedSize}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Color</span>
                <strong className="text-white">{selectedColor}</strong>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between gap-4 text-xl">
                  <span>Total</span>
                  <strong className="text-cognac">{formatMoney(totalPrice)}</strong>
                </div>
              </div>
            </div>
            <p className="mt-6 rounded bg-white/10 p-4 text-sm leading-6 text-white/76">
              Payment method: Cash On Delivery. Free delivery inside Kathmandu Valley and NPR 100 outside the valley.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">Loading checkout...</main>}>
      <CheckoutForm />
    </Suspense>
  );
}
