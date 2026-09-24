import type { Metadata } from 'next';
import { Geist_Mono, Inter, Noto_Sans_Myanmar } from 'next/font/google';
import { siteConfig } from '@/config/site';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoMyanmar = Noto_Sans_Myanmar({
  variable: '--font-myanmar',
  subsets: ['myanmar'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${notoMyanmar.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
