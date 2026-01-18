import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

export async function POST() {
  try {
    // Check if Learnster presentation already exists
    const existing = await prisma.presentation.findFirst({
      where: {
        customerCompanyName: 'Learnster',
      },
    })

    if (existing) {
      return NextResponse.json({ id: existing.id, exists: true })
    }

    // Create the Learnster presentation
    const brandColor = '#543D97'
    const chartColors = generateBrandPalette(brandColor, 5)
    const financialData = generateMockFinancialData(chartColors)

    const presentation = await prisma.presentation.create({
      data: {
        companyName: 'Ludvig & Co',
        logoUrl: '/lco.png',
        primaryColor: brandColor,
        themeMode: 'dark',
        customerCompanyName: 'Learnster',
        customerLogoUrl: '/l_logo.jpg',
        presentationTitle: 'Financial Update 2025',
        financialData: JSON.stringify(financialData),
      },
    })

    return NextResponse.json({ id: presentation.id, exists: false })
  } catch (error) {
    console.error('Error initializing presentation:', error)
    return NextResponse.json(
      { error: 'Failed to initialize presentation' },
      { status: 500 }
    )
  }
}
