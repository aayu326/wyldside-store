import type { Metadata } from "next";
import { Big_Shoulders_Display, Manrope } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const display = Big_Shoulders_Display({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "WYLDSIDE — Live on the Wyld Side",
  description: "Premium streetwear, sportswear, gaming and outdoor apparel. Demo storefront.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
