import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-slate-800 font-sans">
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
