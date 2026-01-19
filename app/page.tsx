import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { generateMockFinancialData } from '@/lib/mockData'
import { generateBrandPalette } from '@/lib/color-utils'

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  // TEMPORARY: Show that server component is running
  console.log('Home page server component is running!')
  
  try {
    // Check if Learnster presentation already exists
    let presentation = await prisma.presentation.findFirst({
      where: {
        customerCompanyName: 'Learnster',
      },
    })
    
    console.log('Presentation lookup result:', presentation ? 'Found' : 'Not found')

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
  } catch (error: any) {
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

    // Show error with details for debugging
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Error</h1>
          <p className="text-gray-600 mb-2">Unable to connect to database or table doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-4">
            Error: {error?.message || 'Unknown error'}
          </p>
          <p className="text-xs text-gray-400">
            Make sure DATABASE_URL is set in Vercel and migrations have been run.
          </p>
        </div>
      </div>
    )
  }

  // Fallback: if no presentation exists and we can't create one, show error
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-900 mb-4">⚠️ Server Component Running</h1>
        <p className="text-gray-700 mb-2">If you see this, the new server component is working!</p>
        <p className="text-sm text-gray-600 mb-4">
          But no presentation was found or created. Check Vercel logs for errors.
        </p>
        <p className="text-xs text-gray-500">
          This is a test message to verify the new code is deployed.
        </p>
      </div>
    </div>
  )
}
