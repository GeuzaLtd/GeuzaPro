import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://geuza.africa';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Geuza – Redefining Smart Assistive Devices',
    template: '%s | Geuza',
  },
  description:
    'Geuza transforms e-waste into affordable, sustainable assistive devices — wheelchairs, crutches, walking aids, and prosthetics — empowering people with disabilities across Africa.',
  keywords: [
    'assistive devices', 'wheelchair Rwanda', 'crutches', 'prosthetics Africa',
    'mobility aids', 'disability inclusion', 'e-waste recycling', 'sustainable assistive technology',
    'Geuza', 'affordable mobility devices',
  ],
  authors: [{ name: 'Geuza', url: SITE_URL }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Geuza',
    title: 'Geuza – Redefining Smart Assistive Devices',
    description:
      'Transforming e-waste into empowerment. Affordable, eco-friendly assistive mobility devices for people with disabilities.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Geuza assistive devices' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geuza – Redefining Smart Assistive Devices',
    description: 'Affordable, eco-friendly assistive mobility devices made from recycled e-waste.',
    images: ['/og-default.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
