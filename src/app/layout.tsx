import type { Metadata } from "next";
import "./globals.css";
import { Web3Providers } from "@/components/providers/Web3Providers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Economic Operating System | Classic OS",
    template: "%s | Classic OS",
  },
  description: "Transform mining into capital, automate DeFi strategies, and maintain productive on-chain positions.",
  applicationName: "Classic OS",
  metadataBase: new URL("https://app.classicos.org"),

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    type: "website",
    siteName: "Classic OS",
    title: "Economic Operating System | Classic OS",
    description: "Transform mining into capital, automate DeFi strategies, and maintain productive on-chain positions.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Economic Operating System | Classic OS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Economic Operating System | Classic OS",
    description: "Transform mining into capital, automate DeFi strategies, and maintain productive on-chain positions.",
    images: ["/opengraph-image.png"],
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
