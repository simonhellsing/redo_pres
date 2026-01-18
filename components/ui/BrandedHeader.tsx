'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BrandedHeaderProps {
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
  presentationId: string
}

export function BrandedHeader({
  customerCompanyName,
  customerLogoUrl,
  presentationTitle,
  presentationId,
}: BrandedHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/share/${presentationId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {customerLogoUrl ? (
              <img src={customerLogoUrl} alt={customerCompanyName} className="h-6 object-contain rounded-md" />
            ) : (
              <div
                className="h-6 w-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--brand-primary, #3B82F6)' }}
              >
                {customerCompanyName[0]}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground">{customerCompanyName}</span>
              <span className="text-foreground-subtle">·</span>
              <span className="text-xs text-foreground-muted">{presentationTitle}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Toast notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full glass text-sm text-foreground flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Länk kopierad!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
