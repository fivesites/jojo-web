import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

export const gtSans = localFont({
  src: [
    { path: "./fonts/GT-America-Regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/GT-America-Medium.woff", weight: "500", style: "normal" },
    { path: "./fonts/GT-America-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-gtSans",
  display: "swap",
});

// GT America Mono
export const gtMono = localFont({
  src: [
    {
      path: "./fonts/GT-America-Mono-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/GT-America-Mono-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gtMono",
  display: "swap",
});

// GT America Compressed (display font)
export const gtCompressed = localFont({
  src: "./fonts/GT-America-Compressed-Black.woff",
  variable: "--font-gtCompressed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOJO",
  description: "studio of vintage couture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gtCompressed.variable} ${gtSans.variable} ${gtMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
