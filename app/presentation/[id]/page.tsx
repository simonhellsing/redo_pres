'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandProvider } from '@/lib/brand-context'
import { HeaderPagination } from '@/components/ui'
import {
  IntroSlide,
  RevenueSlide,
  ExpenseSlide,
  RunwaySlide,
  HeadcountSlide,
  MetricsSlide,
  PLSlide,
  BalanceSlide,
  ProjectionsSlide,
} from '@/components/slides'
import { FinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

interface Presentation {
  id: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  themeMode: 'dark' | 'light'
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
  financialData: FinancialData
}

export default function PresentationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  
  // Get returnTo sales page ID and brand from query params (for light mode demo)
  const returnToSalesId = searchParams?.get('returnTo')
  const brandQuery = searchParams?.get('brand')

  const slideNames = [
    'Introduktion',
    'Intäkter',
    'Kostnader',
    'Kassalikviditet',
    'Team',
    'Enhetsekonomi',
    'Resultaträkning',
    'Balansräkning',
    'Prognos',
  ]

  const totalSlides = slideNames.length

  useEffect(() => {
    if (params.id) {
      fetch(`/api/presentations/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPresentation(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setDirection(index > currentSlide ? 1 : -1)
      setCurrentSlide(index)
    }
  }, [currentSlide, totalSlides])

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1)
      setCurrentSlide((prev) => prev + 1)
    } else if (currentSlide === totalSlides - 1) {
      // Navigate to sales page after the last slide
      // Use returnTo if available (for light mode demo), otherwise use presentation ID
      const salesPageId = returnToSalesId || params.id
      const url = brandQuery ? `/sales/${salesPageId}?brand=${brandQuery}` : `/sales/${salesPageId}`
      router.push(url)
    }
  }, [currentSlide, totalSlides, router, params.id, returnToSalesId])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide((prev) => prev - 1)
    }
  }, [currentSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground-muted">Laddar presentation...</div>
      </div>
    )
  }

  if (!presentation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Presentationen hittades inte</div>
      </div>
    )
  }

  const { financialData, primaryColor } = presentation
  const chartColors = generateBrandPalette(primaryColor, 5)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <IntroSlide
            customerCompanyName={presentation.customerCompanyName}
            customerLogoUrl={presentation.customerLogoUrl}
            presentationTitle={presentation.presentationTitle}
            presenterName={presentation.companyName}
            presenterLogoUrl={presentation.logoUrl}
            primaryColor={primaryColor}
            onStart={nextSlide}
          />
        )
      case 1:
        return <RevenueSlide data={financialData.revenue} primaryColor={primaryColor} />
      case 2:
        return <ExpenseSlide data={financialData.expenses} primaryColor={primaryColor} />
      case 3:
        return <RunwaySlide data={financialData.runway} primaryColor={primaryColor} />
      case 4:
        return <HeadcountSlide data={financialData.headcount} primaryColor={primaryColor} />
      case 5:
        return <MetricsSlide data={financialData.metrics} primaryColor={primaryColor} />
      case 6:
        return <PLSlide data={financialData.pl} primaryColor={primaryColor} chartColors={chartColors} />
      case 7:
        return <BalanceSlide data={financialData.balance} primaryColor={primaryColor} />
      case 8:
        return <ProjectionsSlide data={financialData.projections} primaryColor={primaryColor} chartColors={chartColors} />
      default:
        return null
    }
  }

  return (
    <BrandProvider
      primaryColor={primaryColor}
      logoUrl={presentation.logoUrl}
      companyName={presentation.companyName}
      themeMode={presentation.themeMode}
    >
      <div className="min-h-screen bg-background overflow-hidden">
        <AnimatePresence>
          {currentSlide !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <HeaderPagination
                currentSlide={currentSlide}
                totalSlides={totalSlides}
                onPrevious={prevSlide}
                onNext={nextSlide}
                onGoToSlide={goToSlide}
                slideNames={slideNames}
                customerCompanyName={presentation.customerCompanyName}
                customerLogoUrl={presentation.customerLogoUrl}
                presentationTitle={presentation.presentationTitle}
                presentationId={returnToSalesId || presentation.id}
                brand={brandQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-h-screen">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full h-screen"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </BrandProvider>
  )
}
