import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DreamStream - Premium Streaming Reimagined",
  description: "Enjoy HD and 4K streaming on all your devices with blazing-fast performance",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to critical origins for faster loading */}
        <link rel="preconnect" href="https://dreamstream-delta.vercel.app" />
        <link rel="preconnect" href="https://kfnkivtsewnjxktbabqf.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}