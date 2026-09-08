"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Clock,
  Headphones,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Logo } from "@/components/Logo";
import { ProductGallery } from "@/components/ProductGallery";
import { QuantityPicker } from "@/components/QuantityPicker";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { formatMoney, product } from "@/lib/product";
import { useEffect, useRef, useState } from "react";

export function LandingPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const trackedViewContentRef = useRef(false);
  const total = product.offerPrice * quantity;
  const selectedColorImage =
    product.colors.find((color) => color.name === selectedColor)?.image || product.heroImage;

  useEffect(() => {
    if (trackedViewContentRef.current) return;

    trackedViewContentRef.current = true;
    trackMetaPixelEvent("ViewContent", {
      content_ids: [product.name],
      content_name: product.name,
      content_type: "product",
      currency: product.currency,
      value: product.offerPrice,
    });
  }, []);

  return (
    <main className="min-h-screen bg-ivory text-espresso">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Logo />
        <a
          href={`tel:${product.supportPhone}`}
          onClick={() => {
            trackMetaPixelEvent("Contact", {
              content_name: product.name,
              contact_channel: "phone",
            });
          }}
          className="hidden min-h-11 items-center rounded border border-espresso/15 bg-white px-4 text-sm font-bold text-espresso shadow-sm transition hover:border-cognac sm:inline-flex"
        >
          Call {product.supportPhone}
        </a>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-2 sm:px-8 lg:grid-cols-[1fr_0.86fr] lg:pb-16">
        <div className="py-3">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-leather shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Cash on Delivery available
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-black leading-[1.04] text-espresso sm:text-6xl lg:text-7xl">
            {product.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-espresso/75">
            {product.subheadline}
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-espresso/70">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-end gap-3">
            <span className="font-serif text-4xl font-black text-espresso">
              {formatMoney(product.offerPrice)}
            </span>
            <span className="pb-1 text-lg font-semibold text-espresso/45 line-through">
              {formatMoney(product.price)}
            </span>
            <span className="rounded bg-sage px-3 py-1 text-sm font-black text-white">
              Save {formatMoney(product.price - product.offerPrice)}
            </span>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <CheckoutButton
              quantity={quantity}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              label="Order With COD"
            />
            <a
              href="#order"
              className="inline-flex min-h-12 items-center justify-center rounded border border-espresso/15 bg-white px-6 py-3 text-sm font-bold text-espresso transition hover:border-cognac"
            >
              View details
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["24 hr", "valley delivery"],
              ["Free", "inside Kathmandu Valley"],
              ["COD", "pay after receiving"],
            ].map(([top, bottom]) => (
              <div key={top} className="rounded border border-espresso/10 bg-white p-4 shadow-sm">
                <p className="text-2xl font-black text-espresso">{top}</p>
                <p className="text-sm text-espresso/65">{bottom}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[440px] overflow-hidden rounded bg-espresso shadow-premium sm:min-h-[560px]">
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded bg-white/92 p-4 shadow-sm backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-leather">
              In stock now
            </p>
            <p className="mt-1 text-lg font-black text-espresso">
              {product.name} - {formatMoney(product.offerPrice)}
            </p>
          </div>
        </div>
      </section>

      <section id="order" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-[0.95fr_1fr]">
          <ProductGallery images={product.images} name={product.name} />
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-leather">
              Choose your jacket
            </p>
            <h2 className="font-serif text-4xl font-black text-espresso sm:text-5xl">
              {product.name}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-espresso/75">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-cognac" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded border border-espresso/10 bg-linen p-5">
              <div className="mb-6 grid gap-5">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-espresso/70">
                    <Sparkles className="h-4 w-4 text-cognac" />
                    Color
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`rounded border bg-white p-2 text-left text-sm font-bold transition ${
                          selectedColor === color.name
                            ? "border-espresso ring-2 ring-cognac"
                            : "border-espresso/10 hover:border-cognac"
                        }`}
                      >
                        <span className="relative mb-2 block aspect-square overflow-hidden rounded bg-espresso/5">
                          <Image src={color.image} alt="" fill className="object-cover" sizes="120px" />
                        </span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-espresso/70">
                    <Ruler className="h-4 w-4 text-cognac" />
                    Size
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`grid h-11 min-w-12 place-items-center rounded border px-3 text-sm font-black transition ${
                          selectedSize === size
                            ? "border-espresso bg-espresso text-white"
                            : "border-espresso/15 bg-white text-espresso hover:border-cognac"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-black text-espresso">
                  {formatMoney(product.offerPrice)}
                </span>
                <span className="pb-1 text-lg font-semibold text-espresso/45 line-through">
                  {formatMoney(product.price)}
                </span>
                <span className="rounded bg-cognac px-3 py-1 text-sm font-black text-white">
                  Save {formatMoney(product.price - product.offerPrice)}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-espresso/70">{product.deliveryNote}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-espresso/60">Quantity</p>
                  <QuantityPicker quantity={quantity} onChange={setQuantity} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-espresso/60">Total price</p>
                  <p className="text-3xl font-black text-espresso">{formatMoney(total)}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <CheckoutButton
                  quantity={quantity}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  label="Order Now"
                />
                <CheckoutButton
                  quantity={quantity}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  label="Buy Now"
                  variant="light"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-leather">
                Find your fit
              </p>
              <h2 className="mt-2 font-serif text-4xl font-black text-espresso">
                Size guidance before our team confirms your order.
              </h2>
              <p className="mt-4 leading-7 text-espresso/70">
                Select your preferred size now. If you are unsure, choose the closest fit and mention details during the confirmation call.
              </p>
            </div>
            <div className="overflow-hidden rounded border border-espresso/10 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-espresso px-4 py-3 text-sm font-black text-white">
                <span>Size</span>
                <span>Chest</span>
                <span>Fit</span>
              </div>
              {product.sizeGuide.map((row) => (
                <div
                  key={row.size}
                  className="grid grid-cols-3 border-t border-espresso/10 px-4 py-3 text-sm font-semibold text-espresso/75"
                >
                  <span className="font-black text-espresso">{row.size}</span>
                  <span>{row.chest}</span>
                  <span>{row.fit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-leather">
                Why customers choose it
              </p>
              <h2 className="mt-2 font-serif text-4xl font-black text-espresso">
                Built for style, comfort, and daily confidence.
              </h2>
            </div>
            <CheckoutButton
              quantity={quantity}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              label="Purchase Now"
            />
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.benefits.map((benefit, index) => {
              const icons = [Star, ShieldCheck, BadgeCheck, Clock, Truck, Headphones];
              const Icon = icons[index % icons.length];
              return (
                <article key={benefit.title} className="rounded border border-espresso/10 bg-white p-6 shadow-sm">
                  <Icon className="h-7 w-7 text-cognac" />
                  <h3 className="mt-4 text-xl font-black text-espresso">{benefit.title}</h3>
                  <p className="mt-2 leading-7 text-espresso/68">{benefit.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-espresso py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cognac">
                COD process
              </p>
              <h2 className="mt-2 font-serif text-4xl font-black">Order in four simple steps.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.orderSteps.map((step, index) => (
                <div key={step} className="rounded border border-white/10 bg-white/8 p-5">
                  <span className="grid h-9 w-9 place-items-center rounded bg-cognac text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <p className="mt-4 font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="font-serif text-4xl font-black">Loved by customers</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {product.testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded border border-espresso/10 bg-ivory p-6">
                <div className="flex gap-1 text-cognac">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 leading-7 text-espresso/72">&quot;{testimonial.quote}&quot;</p>
                <p className="mt-5 font-black text-espresso">{testimonial.name}</p>
                <p className="text-sm text-espresso/55">{testimonial.location}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <h2 className="font-serif text-4xl font-black text-espresso">Frequently asked questions</h2>
          <div className="mt-8 divide-y divide-espresso/10 rounded border border-espresso/10">
            {product.faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="cursor-pointer list-none text-lg font-black text-espresso">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-7 text-espresso/68">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl rounded bg-espresso p-8 text-white shadow-premium sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cognac">
                Ready in minutes
              </p>
              <h2 className="mt-2 font-serif text-4xl font-black">Order today. Pay on delivery.</h2>
              <p className="mt-3 max-w-2xl text-white/72">
                Place your COD order now and our sales representative will call soon to confirm your size, location, and delivery time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:min-w-72">
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded bg-white/10 sm:block">
                <Image src={selectedColorImage} alt="" fill className="object-cover" sizes="320px" />
              </div>
              <CheckoutButton
                quantity={quantity}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                label="Order Now"
                variant="light"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
