import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'
import SalesPageClient from './sales-client'

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  try {
    // Check if Learnster presentation already exists
    let presentation = await prisma.presentation.findFirst({
      where: {
        customerCompanyName: 'Learnster',
      },
    })

    // If it doesn't exist, create it
    if (!presentation) {
      const brandColor = '#543D97'
      const chartColors = generateBrandPalette(brandColor, 5)
      const financialData = generateMockFinancialData(chartColors)

      presentation = await prisma.presentation.create({
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
    }

    // Render the sales page directly with the presentation
    if (presentation) {
      return <SalesPageClient presentation={presentation} />
    }
  } catch (error: any) {
    console.error('Error initializing presentation:', error)
    
    // Try to get any existing presentation
    try {
      const existing = await prisma.presentation.findFirst({
        orderBy: { createdAt: 'desc' },
      })
      
      if (existing) {
        return <SalesPageClient presentation={existing} />
      }
    } catch (e) {
      console.error('Error fetching existing presentations:', e)
    }

    // Show error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Error</h1>
          <p className="text-gray-600 mb-2">Unable to connect to database.</p>
          <p className="text-sm text-gray-500 mb-4">
            Error: {error?.message || 'Unknown error'}
          </p>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No presentations found</h1>
        <p className="text-gray-600">Please check your database connection.</p>
      </div>
    </div>
  )
}
