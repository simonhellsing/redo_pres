import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, logoUrl, primaryColor } = body

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Generate mock financial data for the presentation
    const financialData = generateMockFinancialData()

    const presentation = await prisma.presentation.create({
      data: {
        companyName,
        logoUrl: logoUrl || null,
        primaryColor: primaryColor || '#3B82F6',
        financialData: JSON.stringify(financialData),
      },
    })

    return NextResponse.json({
      id: presentation.id,
      companyName: presentation.companyName,
      logoUrl: presentation.logoUrl,
      primaryColor: presentation.primaryColor,
      createdAt: presentation.createdAt,
    })
  } catch (error) {
    console.error('Error creating presentation:', error)
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const presentations = await prisma.presentation.findMany({
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        primaryColor: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(presentations)
  } catch (error) {
    console.error('Error fetching presentations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presentations' },
      { status: 500 }
    )
  }
}
