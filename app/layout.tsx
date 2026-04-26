import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReRooted: cook smart. waste less.",
  description: "Use what you have. Cook smart. Waste less.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
