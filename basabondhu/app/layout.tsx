import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BasaBondhu | Guided House-Hunting in Bangladesh",
  description: "From messy listings to 3 homes worth visiting. Check costs, trade-offs, and call scripts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-slate-800 font-sans">
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
