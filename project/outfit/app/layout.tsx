import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Try-On - AI Outfit Generator',
  description: 'Try on outfits virtually using AI image generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
