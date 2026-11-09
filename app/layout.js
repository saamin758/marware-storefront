import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    template: "%s | MARWARE",
    default: "MARWARE | Contemporary Fashion & Lifestyle Storefront",
  },
  description:
    "Discover tailored men's apparel, contemporary women's dresses, luxury silk Panjabis, and handcrafted leather lifestyle goods crafted in Bangladesh.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MARWARE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-ink selection:text-surface">
        <AuthProvider>
          <CartProvider>
            <MaintenanceGuard>
              <AnnouncementBar />
              <Header />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <Footer />
            </MaintenanceGuard>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
