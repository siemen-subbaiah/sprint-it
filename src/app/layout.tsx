import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sprintit.site'),
  title: {
    template: '%s | Sprint it',
    default: 'Sprint it',
  },
  description: 'The only sprint app you need',
  openGraph: {
    title: 'Sprint it',
    description: 'The only sprint app you need',
    siteName: 'Sprint it',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprint it',
    description: 'The only sprint app you need',
    creator: '@siemen_subbaiah',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <body className={inter.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className='px-4 md:px-20 my-5'>{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
