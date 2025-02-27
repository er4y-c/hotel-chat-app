import React from 'react';
import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const font = Jost({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hotel Chat App',
  description: 'Hotel Chat App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
