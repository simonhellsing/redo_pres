'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Logo Upload Component
function LogoUpload({
  logoUrl,
  setLogoUrl,
  loading,
  label,
  primaryColor,
}: {
  logoUrl: string
  setLogoUrl: (url: string) => void
  loading: boolean
  label: string
  primaryColor: string
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [setLogoUrl])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  if (loading) {
    return (
      <div className="p-4 bg-background-secondary rounded-xl flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-foreground-muted border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-foreground-muted">Searching for logo...</span>
      </div>
    )
  }

  if (logoUrl) {
    return (
      <div className="p-4 bg-background-secondary rounded-xl">
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt="Logo preview" className="h-12 object-contain max-w-[120px]" />
          <button
            onClick={() => setLogoUrl('')}
            className="text-xs text-foreground-muted hover:text-foreground transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`p-4 bg-background-secondary rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        isDragActive ? 'border-brand bg-brand/5' : 'border-white/10 hover:border-white/20'
      }`}
      style={isDragActive ? { borderColor: primaryColor } : undefined}
    >
      <input {...getInputProps()} />
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: primaryColor + '20' }}
        >
          <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-foreground">
            {isDragActive ? 'Drop the image here' : 'Drag & drop logo, or click to select'}
          </p>
          <p className="text-xs text-foreground-subtle">
            PNG, JPG, SVG up to 5MB
          </p>
        </div>
      </div>
    </div>
  )
}

function CreatePresentationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!editId)
  const [error, setError] = useState('')
  
  // Presenter (accounting firm) details
  const [companyName, setCompanyName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoLoading, setLogoLoading] = useState(false)
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  
  // Customer (whose financials) details
  const [customerCompanyName, setCustomerCompanyName] = useState('')
  const [customerLogoUrl, setCustomerLogoUrl] = useState('')
  const [customerLogoLoading, setCustomerLogoLoading] = useState(false)
  const [presentationTitle, setPresentationTitle] = useState('Financial Update 2025')

  // Debounced values for API calls
  const debouncedCompanyName = useDebounce(companyName, 500)
  const debouncedCustomerCompanyName = useDebounce(customerCompanyName, 500)

  // Load existing presentation data when editing
  useEffect(() => {
    if (editId) {
      setInitialLoading(true)
      fetch(`/api/presentations/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError('Presentation not found')
            return
          }
          setCompanyName(data.companyName || '')
          setLogoUrl(data.logoUrl || '')
          setPrimaryColor(data.primaryColor || '#3B82F6')
          setThemeMode(data.themeMode || 'dark')
          setCustomerCompanyName(data.customerCompanyName || '')
          setCustomerLogoUrl(data.customerLogoUrl || '')
          setPresentationTitle(data.presentationTitle || 'Financial Update 2025')
        })
        .catch(() => setError('Failed to load presentation'))
        .finally(() => setInitialLoading(false))
    }
  }, [editId])

  // Fetch logo for presenter company
  const fetchPresenterLogo = useCallback(async (name: string) => {
    if (!name || name.length < 2) return
    
    setLogoLoading(true)
    try {
      const response = await fetch(`/api/brandfetch/search?name=${encodeURIComponent(name)}`)
      const data = await response.json()
      
      if (data.success && data.brand?.logo) {
        setLogoUrl(data.brand.logo)
      }
    } catch (err) {
      console.error('Failed to fetch logo:', err)
    } finally {
      setLogoLoading(false)
    }
  }, [])

  // Fetch logo for customer company
  const fetchCustomerLogo = useCallback(async (name: string) => {
    if (!name || name.length < 2) return
    
    setCustomerLogoLoading(true)
    try {
      const response = await fetch(`/api/brandfetch/search?name=${encodeURIComponent(name)}`)
      const data = await response.json()
      
      if (data.success && data.brand?.logo) {
        setCustomerLogoUrl(data.brand.logo)
      }
    } catch (err) {
      console.error('Failed to fetch customer logo:', err)
    } finally {
      setCustomerLogoLoading(false)
    }
  }, [])

  // Auto-fetch presenter logo when company name changes (only for new presentations)
  useEffect(() => {
    if (debouncedCompanyName && !logoUrl && !editId) {
      fetchPresenterLogo(debouncedCompanyName)
    }
  }, [debouncedCompanyName, logoUrl, fetchPresenterLogo, editId])

  // Auto-fetch customer logo when company name changes (only for new presentations)
  useEffect(() => {
    if (debouncedCustomerCompanyName && !customerLogoUrl && !editId) {
      fetchCustomerLogo(debouncedCustomerCompanyName)
    }
  }, [debouncedCustomerCompanyName, customerLogoUrl, fetchCustomerLogo, editId])

  const handleSubmit = async () => {
    if (!companyName || !customerCompanyName) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const url = editId ? `/api/presentations/${editId}` : '/api/presentations'
      const method = editId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          logoUrl: logoUrl || null,
          primaryColor,
          themeMode,
          customerCompanyName,
          customerLogoUrl: customerLogoUrl || null,
          presentationTitle,
        }),
      })

      if (!response.ok) throw new Error('Failed to save presentation')

      const data = await response.json()
      router.push(`/presentation/${data.id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const colorPresets = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ]

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-foreground-muted hover:text-foreground text-sm mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to presentations
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {editId ? 'Edit Presentation' : 'Create Presentation'}
          </h1>
          <p className="text-foreground-muted mt-1">
            {editId ? 'Update your presentation settings' : 'Set up your branded financial presentation'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Your Brand Section */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: primaryColor + '20' }}
              >
                <svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Your Company
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    // Clear logo when name changes to allow new fetch
                    if (logoUrl && !logoUrl.startsWith('data:') && !editId) {
                      setLogoUrl('')
                    }
                  }}
                  placeholder="e.g., Acme Accounting"
                  className="w-full px-4 py-3 bg-background-secondary rounded-xl border border-white/10 text-foreground placeholder-foreground-subtle focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo
                </label>
                <LogoUpload
                  logoUrl={logoUrl}
                  setLogoUrl={setLogoUrl}
                  loading={logoLoading}
                  label="Upload logo"
                  primaryColor={primaryColor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand Color
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-8 h-8 rounded-lg transition-transform ${primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Theme Mode
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      themeMode === 'dark'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-background-secondary hover:border-white/20'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      themeMode === 'light'
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-background-secondary hover:border-white/20'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Section */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: primaryColor + '20' }}
              >
                <svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              Customer Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Customer Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={customerCompanyName}
                  onChange={(e) => {
                    setCustomerCompanyName(e.target.value)
                    // Clear logo when name changes to allow new fetch (only if not uploaded)
                    if (customerLogoUrl && !customerLogoUrl.startsWith('data:') && !editId) {
                      setCustomerLogoUrl('')
                    }
                  }}
                  placeholder="e.g., TechStartup Inc."
                  className="w-full px-4 py-3 bg-background-secondary rounded-xl border border-white/10 text-foreground placeholder-foreground-subtle focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Customer Logo
                </label>
                <LogoUpload
                  logoUrl={customerLogoUrl}
                  setLogoUrl={setCustomerLogoUrl}
                  loading={customerLogoLoading}
                  label="Upload customer logo"
                  primaryColor={primaryColor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Presentation Title
                </label>
                <input
                  type="text"
                  value={presentationTitle}
                  onChange={(e) => setPresentationTitle(e.target.value)}
                  placeholder="e.g., Q4 2025 Financial Review"
                  className="w-full px-4 py-3 bg-background-secondary rounded-xl border border-white/10 text-foreground placeholder-foreground-subtle focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link href="/" className="flex-1">
              <button className="w-full py-4 rounded-xl font-semibold bg-background-secondary text-foreground hover:bg-background-tertiary transition-colors">
                Cancel
              </button>
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading || !companyName || !customerCompanyName}
              className="flex-1 py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{editId ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{editId ? 'Save Changes' : 'Create Presentation'}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CreatePresentation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CreatePresentationContent />
    </Suspense>
  )
}
