import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VaultX - Secure Payment Platform',
  description: 'Secure payment platform powered by Amazon Pay with SmartCoins and Trust Index',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
