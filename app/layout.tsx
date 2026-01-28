import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pastebin-Lite | Share Code & Text Snippets',
  description: 'A modern pastebin service with expiry and view-limit constraints. Share code, text, and snippets with customizable lifetime.',
  keywords: ['pastebin', 'code sharing', 'snippet', 'paste', 'text sharing'],
  authors: [{ name: 'Pastebin-Lite' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0e14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative overflow-x-hidden">
        {/* Scan line effect overlay */}
        <div className="scan-lines fixed inset-0 pointer-events-none z-50" />
        
        {children}
      </body>
    </html>
  )
}
