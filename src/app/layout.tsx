import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { WishlistProvider } from "@/hooks/useWishlist";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  }),
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <WishlistProvider>
          <SiteShell>{children}</SiteShell>
        </WishlistProvider>
      </body>
    </html>
  );
}
