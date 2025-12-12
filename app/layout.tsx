import React from 'react'
import '@/index.css'
import RemoveExtensionAttributes from '@/components/Client/RemoveExtensionAttributes'

export const metadata = {
  title: 'Little Space World',
  description: 'Find Little Space items and goodies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Suppress hydration warnings in top-level body and remove known noisy
          attributes added by browser extensions that cause mismatches at
          hydration time. */}
      <body suppressHydrationWarning>
        <RemoveExtensionAttributes />
        {children}
      </body>
    </html>
  )
}
