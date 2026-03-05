import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geuza - Redefining Smart Assistive Devices",
  description: "Transforming E-Waste into Empowerment. We create inclusive circular solutions through sustainable assistive devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
