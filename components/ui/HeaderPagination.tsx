'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useBrand } from '@/lib/brand-context'

interface HeaderPaginationProps {
  currentSlide: number
  totalSlides: number
  onPrevious: () => void
  onNext: () => void
  onGoToSlide: (index: number) => void
  slideNames: string[]
  customerCompanyName?: string
  customerLogoUrl?: string | null
  presentationTitle?: string
  presentationId?: string
}

export function HeaderPagination({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  slideNames,
  customerCompanyName,
  customerLogoUrl,
  presentationTitle,
  presentationId,
}: HeaderPaginationProps) {
  const router = useRouter()
  const { themeMode } = useBrand()
  const isLight = themeMode === 'light'
  
  // Theme-aware colors
  const containerBg = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
  const activeDotColor = isLight ? '#09090b' : '#fafafa'
  const inactiveDotColor = isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
  const tooltipBg = isLight ? '#f4f4f5' : '#111111'
  const tooltipText = isLight ? '#09090b' : '#fafafa'
  const buttonColor = isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'
  const buttonHoverBg = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
  const dividerColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)'

  return (
    <header className="fixed top-2 left-0 right-0 z-50 h-10 flex items-center justify-between px-4">
      {/* Left side - Customer info */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0">
        {customerCompanyName && (
          <>
            {customerLogoUrl ? (
              <img src={customerLogoUrl} alt={customerCompanyName} className="h-5 md:h-6 object-contain rounded-md" />
            ) : (
              <div
                className="h-5 w-5 md:h-6 md:w-6 rounded flex items-center justify-center text-white text-[10px] md:text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: 'var(--brand-primary, #3B82F6)' }}
              >
                {customerCompanyName[0]}
              </div>
            )}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] md:text-xs text-foreground font-semibold truncate">{customerCompanyName}</span>
              {presentationTitle && (
                <span className="hidden md:flex items-center gap-2">
                  <span className="text-foreground-subtle">·</span>
                  <span className="text-xs text-foreground-muted truncate">{presentationTitle}</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Dots - centered on desktop, right-aligned on mobile */}
      <div 
        className="md:absolute md:left-1/2 md:-translate-x-1/2 ml-auto flex gap-1 py-1 px-2 rounded-full"
        style={{ backgroundColor: containerBg }}
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} className="relative group">
            <button
              onClick={() => onGoToSlide(i)}
              className="block p-0.5"
            >
              <motion.div
                className="w-1 h-1 rounded-full"
                animate={{
                  backgroundColor: i === currentSlide ? activeDotColor : inactiveDotColor,
                  scale: i === currentSlide ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            </button>
            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div 
                className="px-2 py-1 rounded text-[10px] whitespace-nowrap"
                style={{ backgroundColor: tooltipBg, color: tooltipText }}
              >
                {slideNames[i]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right side arrows and close button (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: buttonColor }}
          onMouseEnter={(e) => {
            if (currentSlide !== 0) {
              e.currentTarget.style.backgroundColor = buttonHoverBg
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: buttonColor }}
          onMouseEnter={(e) => {
            if (currentSlide !== totalSlides - 1) {
              e.currentTarget.style.backgroundColor = buttonHoverBg
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {/* Vertical divider */}
        <div 
          className="h-4 w-px mx-1"
          style={{ backgroundColor: dividerColor }}
        />
        {/* Close/X button */}
        {presentationId && (
          <button
            onClick={() => router.push(`/sales/${presentationId}`)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: buttonColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = buttonHoverBg
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
