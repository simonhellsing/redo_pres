import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const presentation = await prisma.presentation.findUnique({
      where: { id: params.id },
    })

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...presentation,
      financialData: JSON.parse(presentation.financialData),
    })
  } catch (error) {
    console.error('Error fetching presentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if presentation exists
    const existing = await prisma.presentation.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      )
    }

    // Update presentation settings (don't regenerate financial data)
    const presentation = await prisma.presentation.update({
      where: { id: params.id },
      data: {
        companyName,
        logoUrl,
        primaryColor: primaryColor || '#3B82F6',
        themeMode: themeMode || 'dark',
        customerCompanyName,
        customerLogoUrl,
        presentationTitle: presentationTitle || 'Financial Update 2025',
      },
    })

    return NextResponse.json({
      ...presentation,
      financialData: JSON.parse(presentation.financialData),
    })
  } catch (error) {
    console.error('Error updating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    )
  }
}
