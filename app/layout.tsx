import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel"
});

export const metadata: Metadata = {
  title: "Cinematic VFX Director",
  description:
    "Autonomous VFX director workflow generator blending Marathi vision with English technical clarity."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body
        className={`${inter.variable} ${cinzel.variable} font-sans min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
