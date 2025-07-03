import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio | Morphing Geometric Canvas",
  description: "An interactive 3D portfolio experience featuring geometric transformations and minimalist design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-primary`}
      >
        {children}
      </body>
    </html>
  );
}
