import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/CartDrawer";
import { PetalToastContainer } from "@/components/PetalToast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PETAL | Soft & Modern E-Commerce Platform",
  description: "Experience the elegant, editorial shopping experience with PETAL. Premium curated lifestyle products designed for modern homes and slow living.",
  keywords: "lifestyle, e-commerce, modern home, premium shopping, pastel aesthetic, minimalist, editorial, petal",
  authors: [{ name: "PETAL Brand Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-dm bg-petal-canvas text-petal-text-primary antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
        
        {/* Global Client Overlays */}
        <CartDrawer />
        <PetalToastContainer />
      </body>
    </html>
  );
}
