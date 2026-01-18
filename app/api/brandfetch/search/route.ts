import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyName = searchParams.get('name')

  if (!companyName || companyName.trim().length === 0) {
    return NextResponse.json(
      { error: 'Company name is required' },
      { status: 400 }
    )
  }

  const clientId = process.env.BRANDFETCH_CLIENT_ID

  if (!clientId) {
    return NextResponse.json(
      { error: 'Brandfetch client ID is not configured' },
      { status: 500 }
    )
  }

  try {
    const encodedName = encodeURIComponent(companyName.trim())
    const url = `https://api.brandfetch.io/v2/search/${encodedName}?c=${clientId}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Brandfetch API error: ${response.status}`)
    }

    const data = await response.json()

    // Return the first result if available
    if (Array.isArray(data) && data.length > 0) {
      const brand = data[0]
      // Use icon from search results, or construct CDN URL using domain
      const logoUrl = brand.icon || (brand.domain ? `https://cdn.brandfetch.io/${brand.domain}?c=${clientId}` : null)
      
      return NextResponse.json({
        success: true,
        brand: {
          name: brand.name,
          domain: brand.domain,
          icon: brand.icon,
          logo: logoUrl,
        },
      })
    }

    return NextResponse.json({
      success: false,
      message: 'No brand found',
    })
  } catch (error) {
    console.error('Brandfetch API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand information' },
      { status: 500 }
    )
  }
}
