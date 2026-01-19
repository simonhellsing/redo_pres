import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

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

    // Redirect to sales page
    if (presentation?.id) {
      redirect(`/sales/${presentation.id}`)
    }
  } catch (error) {
    console.error('Error initializing presentation:', error)
    
    // Try to get any existing presentation
    try {
      const existing = await prisma.presentation.findFirst({
        orderBy: { createdAt: 'desc' },
      })
      
      if (existing?.id) {
        redirect(`/sales/${existing.id}`)
      }
    } catch (e) {
      console.error('Error fetching existing presentations:', e)
    }
  }

  // Fallback: if no presentation exists and we can't create one, show error
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No presentations found</h1>
        <p className="text-foreground-muted">Please check your database connection.</p>
      </div>
    </div>
  )
}
