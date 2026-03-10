import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: "BJ's EquipTrack",
  description: 'Hardware tracking simplified',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
      </head>
      <body className="antialiased h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
