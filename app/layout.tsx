import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress PNG, JPG, GIF, and WebP images in bulk.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
      },
    ],
    apple: "/favicon.svg",
  },
  verification: {
    google: "nScZP2sBUKhxwKfvtKwCxQkPMCIOOvYNT35E5W2pDn8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#d2fbfe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QNZTMYHPWT"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QNZTMYHPWT');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
