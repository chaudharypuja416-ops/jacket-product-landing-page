import type { Metadata } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leather Jacket | Cash On Delivery",
  description: "Premium leather jacket with 24 hour delivery and Cash On Delivery in Nepal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MetaPixel />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
