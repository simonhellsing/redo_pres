import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

export async function POST() {
  try {
    // Check if light mode demo presentation already exists
    const existing = await prisma.presentation.findFirst({
      where: {
        customerCompanyName: 'Learnifier',
        themeMode: 'light',
      },
    })

    const brandColor = '#2E9ED0'
    const chartColors = generateBrandPalette(brandColor, 5)
    const financialData = generateMockFinancialData(chartColors)

    if (existing) {
      // Update existing presentation to ensure it has the correct accounting firm and logo URL
      const updated = await prisma.presentation.update({
        where: { id: existing.id },
        data: {
          companyName: 'Ludvig & Co',
          logoUrl: '/lco.png',
          customerLogoUrl: '/learnifier_logo.jpg',
          primaryColor: brandColor,
          financialData: JSON.stringify(financialData),
        },
      })
      return NextResponse.json({ id: updated.id, exists: true })
    }

    // Create the light mode Learnifier presentation
    const presentation = await prisma.presentation.create({
      data: {
        companyName: 'Ludvig & Co',
        logoUrl: '/lco.png',
        primaryColor: brandColor,
        themeMode: 'light',
        customerCompanyName: 'Learnifier',
        customerLogoUrl: '/learnifier_logo.jpg',
        presentationTitle: 'Financial Update 2025',
        financialData: JSON.stringify(financialData),
      },
    })

    return NextResponse.json({ id: presentation.id, exists: false })
  } catch (error) {
    console.error('Error creating light mode demo presentation:', error)
    return NextResponse.json(
      { error: 'Failed to create light mode demo presentation' },
      { status: 500 }
    )
  }
}
