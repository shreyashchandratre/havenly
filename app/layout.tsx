import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes' // 1. Import the provider
import './globals.css'
import { AppLocaleProvider } from './locale-provider'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Havenly | Premium Rental Marketplace',
  description: 'Find and book unique accommodations around the world.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`} style={{ letterSpacing: '-0.01em' }}>
        {/* 2. Wrap children with the ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Global locale/currency provider (client-side) */}
          <AppLocaleProvider>{children}</AppLocaleProvider>
        </ThemeProvider>
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}