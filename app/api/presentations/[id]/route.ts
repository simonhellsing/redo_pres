import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const presentation = await prisma.presentation.findUnique({
      where: { id },
    })

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: presentation.id,
      companyName: presentation.companyName,
      logoUrl: presentation.logoUrl,
      primaryColor: presentation.primaryColor,
      financialData: JSON.parse(presentation.financialData),
      createdAt: presentation.createdAt,
    })
  } catch (error) {
    console.error('Error fetching presentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.presentation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting presentation:', error)
    return NextResponse.json(
      { error: 'Failed to delete presentation' },
      { status: 500 }
    )
  }
}
