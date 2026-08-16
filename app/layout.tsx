import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
