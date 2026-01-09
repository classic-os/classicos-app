import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/components/providers/Web3Providers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Classic OS App",
    template: "%s | Classic OS",
  },
  description: "The operating system for Ethereum Classic.",
  applicationName: "Classic OS",
  metadataBase: new URL("https://app.classicos.org"),

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    type: "website",
    siteName: "Classic OS",
    title: "Classic OS App",
    description: "The operating system for Ethereum Classic.",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "Classic OS — Ethereum Classic Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Classic OS App",
    description: "The operating system for Ethereum Classic.",
    images: ["/opengraph-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Providers>
          <AppShell>{children}</AppShell>
        </Web3Providers>
      </body>
    </html>
  );
}
