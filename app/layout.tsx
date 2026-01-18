import type { Metadata } from 'next'
import { Inter, Lora, Noto_Sans, Oxanium } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lora = Lora({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-lora',
})

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

const oxanium = Oxanium({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-oxanium',
})

// Note: Geom font is not available via Google Fonts, using a similar geometric sans-serif alternative
// If Geom is required, it would need to be loaded from a custom font file

export const metadata: Metadata = {
  title: 'Finansiella Presentationer | Skapa Fantastiska Finansiella Uppdateringar',
  description: 'Skapa vackra, interaktiva finansiella presentationer med ditt varumärke för dina kunder. Simulera scenarier i realtid och dela med en enda länk.',
  keywords: ['finansiella presentationer', 'investeraruppdateringar', 'finansiell instrumentpanel', 'startup-nyckeltal'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv" className={`${inter.variable} ${lora.variable} ${notoSans.variable} ${oxanium.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
