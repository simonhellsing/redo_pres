// Color utility functions for generating brand-cohesive chart palettes

interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Convert a hex color to HSL
 */
export function hexToHSL(hex: string): HSL {
  // Remove # if present
  const cleanHex = hex.replace('#', '')
  
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255

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

  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  }
}

/**
 * Convert HSL values to a hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const a = s * Math.min(l, 1 - l)
  
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Generate a cohesive color palette based on a primary brand color.
 * Uses analogous color harmony with varied saturation/lightness for visual distinction.
 * 
 * @param primaryHex - The primary brand color in hex format
 * @param count - Number of colors to generate (default: 5)
 * @returns Array of hex color strings
 */
export function generateBrandPalette(primaryHex: string, count: number = 5): string[] {
  const { h, s, l } = hexToHSL(primaryHex)
  
  const palette: string[] = []
  
  // Define hue offsets for a balanced, visually distinct palette
  // These create an analogous-to-triadic spread that remains cohesive
  const hueOffsets = [0, 30, -25, 55, -50, 80, -75, 105, -100, 130]
  
  // Saturation and lightness variations to ensure visual distinction
  const satVariations = [0, 5, -5, 10, -10]
  const lightVariations = [0, 8, -5, 12, -8]
  
  for (let i = 0; i < count; i++) {
    const hueOffset = hueOffsets[i % hueOffsets.length]
    const newHue = (h + hueOffset + 360) % 360
    
    // Vary saturation, keeping it in a reasonable range
    const satVar = satVariations[i % satVariations.length]
    const newSat = Math.min(85, Math.max(45, s + satVar))
    
    // Vary lightness for visual separation
    const lightVar = lightVariations[i % lightVariations.length]
    const newLight = Math.min(60, Math.max(40, l + lightVar))
    
    palette.push(hslToHex(newHue, newSat, newLight))
  }
  
  return palette
}

/**
 * Generate a monochromatic palette (same hue, varying saturation/lightness)
 * Useful for charts where you want a more subtle, unified look
 */
export function generateMonochromaticPalette(primaryHex: string, count: number = 5): string[] {
  const { h, s } = hexToHSL(primaryHex)
  
  const palette: string[] = []
  
  // Distribute lightness values evenly across the range
  const minLight = 35
  const maxLight = 65
  const step = (maxLight - minLight) / (count - 1)
  
  for (let i = 0; i < count; i++) {
    const newLight = minLight + (step * i)
    // Slightly vary saturation to add depth
    const newSat = Math.min(90, Math.max(50, s + (i % 2 === 0 ? 5 : -5)))
    palette.push(hslToHex(h, newSat, newLight))
  }
  
  return palette
}

/**
 * Get a contrasting color for text/labels on a given background
 */
export function getContrastColor(hex: string): string {
  const { l } = hexToHSL(hex)
  return l > 50 ? '#1a1a1a' : '#ffffff'
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex)
  const newLight = Math.min(100, l + percent)
  return hslToHex(h, s, newLight)
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex)
  const newLight = Math.max(0, l - percent)
  return hslToHex(h, s, newLight)
}

/**
 * Add transparency to a hex color
 */
export function withAlpha(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.slice(0, 2), 16)
  const g = parseInt(cleanHex.slice(2, 4), 16)
  const b = parseInt(cleanHex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Theme-aware chart styling configuration
 * Returns colors appropriate for dark or light mode
 */
export interface ChartThemeColors {
  axisStroke: string
  gridStroke: string
  tooltipBackground: string
  tooltipBorder: string
  tooltipText: string
  referenceLineStroke: string
}

export function getChartThemeColors(themeMode: 'dark' | 'light'): ChartThemeColors {
  if (themeMode === 'light') {
    return {
      axisStroke: 'rgba(0, 0, 0, 0.5)',
      gridStroke: 'rgba(0, 0, 0, 0.1)',
      tooltipBackground: 'rgba(255, 255, 255, 0.95)',
      tooltipBorder: '1px solid rgba(0, 0, 0, 0.1)',
      tooltipText: '#1a1a1a',
      referenceLineStroke: 'rgba(0, 0, 0, 0.2)',
    }
  }
  
  // Dark mode (default)
  return {
    axisStroke: 'rgba(255, 255, 255, 0.5)',
    gridStroke: 'rgba(255, 255, 255, 0.1)',
    tooltipBackground: 'rgba(0, 0, 0, 0.8)',
    tooltipBorder: '1px solid rgba(255, 255, 255, 0.1)',
    tooltipText: '#ffffff',
    referenceLineStroke: 'rgba(255, 255, 255, 0.2)',
  }
}

/**
 * Semantic/status colors that adapt based on theme mode
 * These colors are optimized for readability in each mode
 */
export interface StatusColors {
  // Success/positive colors (green)
  success: string
  successBg: string
  // Danger/negative colors (red)
  danger: string
  dangerBg: string
  // Warning colors (amber/yellow)
  warning: string
  warningBg: string
  // Info colors (blue)
  info: string
  infoBg: string
}

export function getStatusColors(themeMode: 'dark' | 'light'): StatusColors {
  if (themeMode === 'light') {
    return {
      success: '#15803d',      // green-700
      successBg: 'rgba(21, 128, 61, 0.1)',
      danger: '#b91c1c',       // red-700
      dangerBg: 'rgba(185, 28, 28, 0.1)',
      warning: '#b45309',      // amber-700
      warningBg: 'rgba(180, 83, 9, 0.1)',
      info: '#1d4ed8',         // blue-700
      infoBg: 'rgba(29, 78, 216, 0.1)',
    }
  }
  
  // Dark mode (default)
  return {
    success: '#4ade80',        // green-400
    successBg: 'rgba(74, 222, 128, 0.2)',
    danger: '#f87171',         // red-400
    dangerBg: 'rgba(248, 113, 113, 0.2)',
    warning: '#fbbf24',        // amber-400
    warningBg: 'rgba(251, 191, 36, 0.2)',
    info: '#60a5fa',           // blue-400
    infoBg: 'rgba(96, 165, 250, 0.2)',
  }
}
