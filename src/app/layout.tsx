import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/layout/SiteHeader";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Utdanningssti Norge",
  description:
    "Planlegg utdanningsveien din fra 10. trinn gjennom videregående og videre.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        <Providers>
          <div className="bg-mesh min-h-screen">
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 py-6 pb-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
