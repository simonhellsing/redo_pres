import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

export async function GET() {
  try {
    const presentations = await prisma.presentation.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        primaryColor: true,
        customerCompanyName: true,
        customerLogoUrl: true,
        presentationTitle: true,
        createdAt: true,
      },
    })

    return NextResponse.json(presentations)
  } catch (error) {
    console.error('Error fetching presentations:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      companyName, 
      logoUrl, 
      primaryColor,
      themeMode,
      customerCompanyName,
      customerLogoUrl,
      presentationTitle,
    } = body

    // Generate chart colors from the brand's primary color
    const brandColor = primaryColor || '#3B82F6'
    const chartColors = generateBrandPalette(brandColor, 5)

    // Generate mock financial data with brand-cohesive colors
    const financialData = generateMockFinancialData(chartColors)

    const presentation = await prisma.presentation.create({
      data: {
        companyName,
        logoUrl,
        primaryColor: primaryColor || '#3B82F6',
        themeMode: themeMode || 'dark',
        customerCompanyName,
        customerLogoUrl,
        presentationTitle: presentationTitle || 'Financial Update 2025',
        financialData: JSON.stringify(financialData),
      },
    })

    return NextResponse.json(presentation)
  } catch (error) {
    console.error('Error creating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    )
  }
}
