import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Selected Offers',
  description: 'Carefully chosen products worth your attention.',
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
