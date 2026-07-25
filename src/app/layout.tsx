import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Warung Nutrisi - Makan Bergizi Gratis untuk Indonesia",
  description: "Platform terintegrasi program Makan Bergizi Gratis (MBG) untuk Indonesia",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-surface-muted text-gray-900 font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
