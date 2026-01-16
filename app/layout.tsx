import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Face Swap Posters",
  description: "Create your personalized sports posters with AI face swap",
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
