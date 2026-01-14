'use client'

import React, { createContext, useContext, useEffect, useMemo } from 'react'

interface BrandConfig {
  companyName: string
  logoUrl: string | null
  primaryColor: string
}

interface BrandContextType extends BrandConfig {
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    primaryGlow: string
  }
}

const defaultBrand: BrandConfig = {
  companyName: 'Your Company',
  logoUrl: null,
  primaryColor: '#3B82F6',
}

const BrandContext = createContext<BrandContextType | null>(null)

// Helper to generate color variations
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 220, s: 90, l: 56 }
  
  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function generateColorVariations(primaryColor: string) {
  const hsl = hexToHSL(primaryColor)
  
  return {
    primary: primaryColor,
    primaryLight: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.min(hsl.l + 20, 85)),
    primaryDark: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 15)),
    primaryGlow: `${primaryColor}40`, // 25% opacity for glow effects
  }
}

export function BrandProvider({
  children,
  brand = defaultBrand,
}: {
  children: React.ReactNode
  brand?: BrandConfig
}) {
  const colors = useMemo(() => generateColorVariations(brand.primaryColor), [brand.primaryColor])

  useEffect(() => {
    // Set CSS custom properties on document root
    const root = document.documentElement
    root.style.setProperty('--brand-primary', colors.primary)
    root.style.setProperty('--brand-primary-light', colors.primaryLight)
    root.style.setProperty('--brand-primary-dark', colors.primaryDark)
    root.style.setProperty('--brand-primary-glow', colors.primaryGlow)
  }, [colors])

  const contextValue: BrandContextType = {
    ...brand,
    colors,
  }

  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}

export function useBrandColors() {
  const brand = useBrand()
  return brand.colors
}
