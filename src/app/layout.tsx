import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderByte - Digital Menu",
  description: "QR Code Digital Menu for Hospitality Establishments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
