'use client'

import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react'
import { generateBrandPalette } from './color-utils'

interface BrandContextType {
  primaryColor: string
  logoUrl: string | null
  companyName: string
  themeMode: 'dark' | 'light'
  chartColors: string[]
}

const DEFAULT_CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const BrandContext = createContext<BrandContextType>({
  primaryColor: '#3B82F6',
  logoUrl: null,
  companyName: '',
  themeMode: 'dark',
  chartColors: DEFAULT_CHART_COLORS,
})

export function BrandProvider({
  children,
  primaryColor,
  logoUrl,
  companyName,
  themeMode = 'dark',
}: {
  children: ReactNode
  primaryColor: string
  logoUrl: string | null
  companyName: string
  themeMode?: 'dark' | 'light'
}) {
  // Generate chart colors based on the brand's primary color
  const chartColors = useMemo(
    () => generateBrandPalette(primaryColor, 5),
    [primaryColor]
  )

  useEffect(() => {
    // Set theme mode
    document.documentElement.setAttribute('data-theme', themeMode)
    
    // Set CSS custom properties for dynamic theming
    document.documentElement.style.setProperty('--brand-primary', primaryColor)
    
    // Generate lighter and darker variants
    const hex = primaryColor.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    
    // Lighter variant
    const lightR = Math.min(255, r + 100)
    const lightG = Math.min(255, g + 100)
    const lightB = Math.min(255, b + 100)
    document.documentElement.style.setProperty(
      '--brand-primary-light',
      `rgb(${lightR}, ${lightG}, ${lightB})`
    )
    
    // Darker variant
    const darkR = Math.max(0, r - 50)
    const darkG = Math.max(0, g - 50)
    const darkB = Math.max(0, b - 50)
    document.documentElement.style.setProperty(
      '--brand-primary-dark',
      `rgb(${darkR}, ${darkG}, ${darkB})`
    )
    
    // Glow color
    document.documentElement.style.setProperty(
      '--brand-primary-glow',
      `rgba(${r}, ${g}, ${b}, 0.25)`
    )

    // Set chart color CSS variables
    chartColors.forEach((color, index) => {
      document.documentElement.style.setProperty(`--chart-color-${index + 1}`, color)
    })
    
    // Cleanup: reset theme when component unmounts
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [primaryColor, themeMode, chartColors])

  return (
    <BrandContext.Provider value={{ primaryColor, logoUrl, companyName, themeMode, chartColors }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  return useContext(BrandContext)
}
