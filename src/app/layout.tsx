import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bootanimdeck.vercel.app"),
  title: "BootAnimDeck — Android Boot Animation Studio & Gallery",
  description: "Explore 220+ Android boot animations in high-quality previews. Parse desc.txt, adjust speed and loop parameters, download root-ready ZIPs, or create custom boot animations from video — all client-side.",
  keywords: ["Android", "Boot Animation", "Gallery", "Custom ROMs", "desc.txt", "GIF Preview", "Android Customization", "BootAnimDeck", "flashable zip"],
  authors: [{ name: "Mr Hasan Hamid", url: "https://19-hasan.vercel.app" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "BootAnimDeck — Android Boot Animation Studio & Gallery",
    description: "220+ Android boot animations. Edit parameters, simulate playback, convert video, and download root-ready ZIPs.",
    type: "website",
    locale: "en_US",
    siteName: "BootAnimDeck",
  },
  twitter: {
    card: "summary_large_image",
    title: "BootAnimDeck — Android Boot Animation Studio",
    description: "220+ Android boot animations. Edit, simulate, convert & download.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: "I2tl1dwUHUc_wwbtmXgPF9SlGc9tHdVYAzlK_7kRnUA",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
        <PWARegister />
        <Header />
        
        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
