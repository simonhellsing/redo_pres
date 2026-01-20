'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandProvider } from '@/lib/brand-context'

interface Presentation {
  id: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  themeMode: string
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
}

type BrandType = 1 | 2

interface SalesPageClientProps {
  presentation: Presentation
}

export default function SalesPageClient({ presentation }: SalesPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Get brand from query params (2 = Brand1View), default to 1 (Brand2View)
  const brandFromQuery = searchParams?.get('brand')
  const [activeBrand, setActiveBrand] = useState<BrandType>(
    brandFromQuery === '2' ? 2 : 1
  )

  // Normalize themeMode to a safe value for BrandProvider
  const normalizedThemeMode: 'dark' | 'light' =
    presentation.themeMode === 'light' ? 'light' : 'dark'

  const handleShowExample = () => {
    router.push(`/presentation/${presentation.id}`)
  }

  const handleShowExampleLightDemo = async () => {
    try {
      const res = await fetch('/api/presentations/demo-light', { method: 'POST' })
      const data = await res.json()
      if (data.id) {
        router.push(`/presentation/${data.id}?returnTo=${presentation.id}&brand=2`)
      }
    } catch (error) {
      console.error('Error loading light mode demo:', error)
    }
  }

  const handleInterested = () => {
    window.open('https://example.com/interested', '_blank')
  }

  const handleNotRelevant = () => {
    window.open('https://example.com/not-relevant', '_blank')
  }

  return (
    <BrandProvider
      primaryColor={presentation.primaryColor}
      logoUrl={presentation.logoUrl}
      companyName={presentation.companyName}
      themeMode={normalizedThemeMode}
    >
      <div className="relative min-h-screen w-full">
        {activeBrand === 1 ? (
          <Brand2View
            presentation={presentation}
            onShowExample={handleShowExample}
            onInterested={handleInterested}
            onNotRelevant={handleNotRelevant}
          />
        ) : (
          <Brand1View
            presentation={presentation}
            onShowExample={handleShowExampleLightDemo}
            onInterested={handleInterested}
            onNotRelevant={handleNotRelevant}
          />
        )}
        
        {/* Floating Tab Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-2 py-2 flex gap-2">
            <button
              onClick={() => setActiveBrand(1)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeBrand === 1
                  ? 'bg-[#213327] text-white'
                  : 'text-[#213327] hover:bg-gray-100'
              }`}
            >
              Brand 1
            </button>
            <button
              onClick={() => setActiveBrand(2)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeBrand === 2
                  ? 'bg-[#213327] text-white'
                  : 'text-[#213327] hover:bg-gray-100'
              }`}
            >
              Brand 2
            </button>
          </div>
        </div>
      </div>
    </BrandProvider>
  )
}

// Brand 2 View (Original Light Theme)
function Brand1View({
  presentation,
  onShowExample,
  onInterested,
  onNotRelevant,
}: {
  presentation: Presentation
  onShowExample: () => void
  onInterested: () => void
  onNotRelevant: () => void
}) {
  const words = ['begriplig', 'överskådlig', 'tydlig', 'förståelig']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const wordRef = useRef<HTMLSpanElement>(null)
  const merRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col items-start overflow-clip p-3 sm:p-4 md:p-6 relative w-full pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-12 lg:px-[120px] py-3 w-full">
        <div className="flex gap-1 sm:gap-2 items-center">
          <div className="flex items-center pb-[2px] pt-0 px-1 sm:px-2">
            <div className="flex flex-col gap-[2px] items-center justify-center">
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
                <div className="bg-[#213327] rounded-[1px] size-[3px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col font-lora font-medium justify-center leading-none not-italic relative text-[#213327] text-xl sm:text-2xl">
            <p className="leading-6">Finview</p>
          </div>
        </div>
        <button
          onClick={onShowExample}
          className="bg-[#e5e3e1] flex gap-[8px] items-center justify-center pl-4 pr-6 py-[14px] rounded-[40px] shrink-0 cursor-pointer hover:bg-[#d5d3d1] transition-colors"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#213327" />
          </svg>
          <div className="flex flex-col font-noto-sans font-semibold justify-center leading-none not-italic relative text-[#213327] text-xs">
            <p className="leading-5">Visa demo</p>
          </div>
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center px-4 sm:px-12 md:px-32 lg:px-[400px] py-8 sm:py-12 md:py-16 lg:py-20 w-full relative">
        {/* Animated Grid Background with Vignette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(33,51,39,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(33,51,39,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, #faf8f6 70%, #faf8f6 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div className="flex flex-1 flex-col items-center w-full relative z-10">
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[12px] items-start text-center leading-none not-italic w-full">
            <div className="flex flex-col font-lora font-medium justify-center relative text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#213327] w-full">
              <p className="leading-tight sm:leading-tight md:leading-snug lg:leading-[40px] mb-0">Gör era kunders ekonomi</p>
              <p className="leading-tight sm:leading-tight md:leading-snug lg:leading-[40px] inline-flex items-baseline justify-center w-full transition-all duration-500 ease-out gap-2">
                <span ref={merRef} className="leading-[40px]">mer</span>
                <span 
                  ref={wordRef}
                  key={currentWordIndex}
                  className="leading-[40px] text-[#767676] inline-block"
                >
                  {words[currentWordIndex].split('').map((letter, letterIndex) => (
                    <span
                      key={`${currentWordIndex}-${letterIndex}`}
                      className="inline-block animate-letter-in"
                      style={{
                        animationDelay: `${letterIndex * 50}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Selling Points and Image */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-[20px] items-start p-6 sm:p-8 lg:p-[40px] w-full">
        {/* Selling Points Card */}
        <div className="bg-[#e5e3e1] flex flex-1 flex-col gap-6 sm:gap-8 lg:gap-[40px] items-center justify-center p-6 sm:p-8 lg:p-[60px] relative rounded-xl lg:rounded-[12px] self-stretch w-full lg:w-auto">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
            {/* First Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" fill="#6b8a76" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-noto-sans font-bold justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Gör siffror begripliga för kunder</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-medium justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Gör komplex ekonomi begriplig för kunder utan ekonomibakgrund.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16.5C9.51 16.5 7.5 14.49 7.5 12C7.5 9.51 9.51 7.5 12 7.5C14.49 7.5 16.5 9.51 16.5 12C16.5 14.49 14.49 16.5 12 16.5ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#6b8a76" />
                    <circle cx="12" cy="12" r="2" fill="#6b8a76" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-noto-sans font-bold justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Inbyggd simulering av scenarier</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-medium justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Testa "tänk om"-frågor tillsammans med kunden och visa effekterna i realtid.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Second Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.5" cy="8.5" r="1.5" fill="#6b8a76" />
                    <path d="M12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16ZM18 10.5C18.83 10.5 19.5 9.83 19.5 9C19.5 8.17 18.83 7.5 18 7.5C17.17 7.5 16.5 8.17 16.5 9C16.5 9.83 17.17 10.5 18 10.5ZM18 16.5C17.17 16.5 16.5 15.83 16.5 15C16.5 14.17 17.17 13.5 18 13.5C18.83 13.5 19.5 14.17 19.5 15C19.5 15.83 18.83 16.5 18 16.5Z" fill="#6b8a76" />
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#6b8a76" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-noto-sans font-bold justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Anpassat till ert varumärke</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-medium justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Presentationerna anpassas med er logotyp och tydlig avsändare.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2.01 3.9 2.01 5L2 19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V8H20V19Z" fill="#6b8a76" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-noto-sans font-bold justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Redo att användas i kundmöten</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-medium justify-center relative text-[#213327] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Fungerar som ett komplement till befintliga system och rapporter.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-1 flex-col items-center justify-center min-h-px min-w-px overflow-clip px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-20 relative rounded-xl lg:rounded-[12px] w-full lg:w-auto">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-xl lg:rounded-[12px] overflow-hidden">
            <img src="/002_bg_01.jpg" alt="" className="absolute inset-0 w-full h-full object-cover rounded-xl lg:rounded-[12px]" />
            <div className="absolute bg-[rgba(26,26,26,0.12)] inset-0 rounded-xl lg:rounded-[12px]" />
          </div>
          <div className="relative rounded-xl lg:rounded-[12px] shadow-[4px_8px_12px_0px_rgba(0,0,0,0.25)] shrink-0 w-full max-w-[748px] overflow-hidden mx-auto" style={{ aspectRatio: '1440/924' }}>
            <img src="/001_screen_01.jpg" alt="App Preview" className="w-full h-full object-cover rounded-xl lg:rounded-[12px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Brand 1 View (Dark Theme)
function Brand2View({
  presentation,
  onShowExample,
  onInterested,
  onNotRelevant,
}: {
  presentation: Presentation
  onShowExample: () => void
  onInterested: () => void
  onNotRelevant: () => void
}) {
  const words = ['begriplig', 'överskådlig', 'tydlig', 'förståelig']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const wordRef = useRef<HTMLSpanElement>(null)
  const merRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-start overflow-clip p-3 sm:p-4 md:p-6 relative w-full pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-12 lg:px-[120px] py-3 w-full">
        <div className="flex gap-1 sm:gap-2 items-center">
          <div className="flex items-center pb-[2px] pt-0 px-1 sm:px-2">
            <div className="flex flex-col gap-[2px] items-center justify-center">
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
              </div>
              <div className="flex flex-wrap gap-[2px] items-start justify-center w-full">
                <div className="bg-white rounded-[1px] size-[3px]" />
                <div className="bg-white rounded-[1px] size-[3px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-col font-oxanium font-semibold justify-center leading-none not-italic relative text-white text-xl sm:text-2xl tracking-[-0.48px]">
            <p className="leading-6">Revisio</p>
          </div>
        </div>
        <button
          onClick={onShowExample}
          className="border border-[#484848] flex gap-[8px] items-center justify-center pl-3 pr-5 py-[10px] rounded-[40px] shrink-0 cursor-pointer hover:border-[#5a5a5a] hover:bg-[#252525] transition-colors"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="white" />
          </svg>
          <div className="flex flex-col font-noto-sans font-semibold justify-center leading-none not-italic relative text-white text-xs">
            <p className="leading-5">Visa demo</p>
          </div>
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center px-4 sm:px-12 md:px-32 lg:px-[400px] py-8 sm:py-12 md:py-16 lg:py-20 w-full relative">
        {/* Animated Grid Background with Vignette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, #1a1a1a 70%, #1a1a1a 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div className="flex flex-1 flex-col items-center w-full relative z-10">
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-[12px] items-start text-center leading-none not-italic w-full">
            <div className="flex flex-col font-lora font-medium justify-center relative text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-white w-full">
              <p className="leading-tight sm:leading-tight md:leading-snug lg:leading-[40px] mb-0">Gör era kunders ekonomi</p>
              <p className="leading-tight sm:leading-tight md:leading-snug lg:leading-[40px] inline-flex items-baseline justify-center w-full transition-all duration-500 ease-out gap-2">
                <span ref={merRef} className="leading-[40px]">mer</span>
                <span 
                  ref={wordRef}
                  key={currentWordIndex}
                  className="leading-[40px] text-[#767676] inline-block"
                >
                  {words[currentWordIndex].split('').map((letter, letterIndex) => (
                    <span
                      key={`${currentWordIndex}-${letterIndex}`}
                      className="inline-block animate-letter-in"
                      style={{
                        animationDelay: `${letterIndex * 50}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Selling Points and Image */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-[20px] items-start p-6 sm:p-8 lg:p-[40px] w-full">
        {/* Selling Points Card */}
        <div className="bg-[#252525] flex flex-1 flex-col gap-6 sm:gap-8 lg:gap-[40px] items-center justify-center p-6 sm:p-8 lg:p-[60px] relative rounded-xl lg:rounded-[12px] self-stretch w-full lg:w-auto">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
            {/* First Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16ZM7 9H9V11H7V9ZM11 9H13V11H11V9ZM15 9H17V11H15V9Z" fill="#91BEEB" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-lora font-bold justify-center relative text-white w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Gör siffror begripliga för kunder</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-normal justify-center relative text-[#d1d1d1] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Gör komplex ekonomi begriplig för kunder utan ekonomibakgrund.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16.5C9.51 16.5 7.5 14.49 7.5 12C7.5 9.51 9.51 7.5 12 7.5C14.49 7.5 16.5 9.51 16.5 12C16.5 14.49 14.49 16.5 12 16.5ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#91BEEB" />
                    <circle cx="12" cy="12" r="2" fill="#91BEEB" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-lora font-bold justify-center relative text-white w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Inbyggd simulering av scenarier</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-normal justify-center relative text-[#d1d1d1] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Testa "tänk om"-frågor tillsammans med kunden och visa effekterna i realtid.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Second Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-[60px] items-start w-full">
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.5" cy="8.5" r="1.5" fill="#91BEEB" />
                    <path d="M12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16ZM18 10.5C18.83 10.5 19.5 9.83 19.5 9C19.5 8.17 18.83 7.5 18 7.5C17.17 7.5 16.5 8.17 16.5 9C16.5 9.83 17.17 10.5 18 10.5ZM18 16.5C17.17 16.5 16.5 15.83 16.5 15C16.5 14.17 17.17 13.5 18 13.5C18.83 13.5 19.5 14.17 19.5 15C19.5 15.83 18.83 16.5 18 16.5Z" fill="#91BEEB" />
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#91BEEB" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-lora font-bold justify-center relative text-white w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Anpassat till ert varumärke</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-normal justify-center relative text-[#d1d1d1] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Presentationerna anpassas med er logotyp och tydlig avsändare.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 lg:gap-[12px] items-start w-full">
                <div className="overflow-clip relative size-5">
                  <svg className="block max-w-none size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2.01 3.9 2.01 5L2 19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V8H20V19Z" fill="#91BEEB" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 lg:gap-[4px] items-center justify-center leading-none not-italic text-xs sm:text-sm lg:text-[14px] w-full">
                  <div className="flex flex-col font-lora font-bold justify-center relative text-white w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Redo att användas i kundmöten</p>
                  </div>
                  <div className="flex flex-col font-noto-sans font-normal justify-center relative text-[#d1d1d1] w-full">
                    <p className="leading-4 sm:leading-5 lg:leading-[20px]">Fungerar som ett komplement till befintliga system och rapporter.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-1 flex-col items-center justify-center min-h-px min-w-px overflow-clip px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-20 relative rounded-xl lg:rounded-[12px] w-full lg:w-auto">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-xl lg:rounded-[12px] overflow-hidden">
            <img src="/002_bg_01.jpg" alt="" className="absolute inset-0 w-full h-full object-cover rounded-xl lg:rounded-[12px]" />
            <div className="absolute bg-[rgba(26,26,26,0.12)] inset-0 rounded-xl lg:rounded-[12px]" />
          </div>
          <div className="relative rounded-xl lg:rounded-[12px] shadow-[4px_8px_12px_0px_rgba(0,0,0,0.25)] shrink-0 w-full max-w-[748px] overflow-hidden mx-auto" style={{ aspectRatio: '1440/924' }}>
            <img src="/001_screen_01.jpg" alt="App Preview" className="w-full h-full object-cover rounded-xl lg:rounded-[12px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
