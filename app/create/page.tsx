'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

const presetColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
]

export default function CreatePage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#3B82F6')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) {
      setError('Please enter a company name')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          primaryColor,
          logoUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create presentation')
      }

      const data = await response.json()
      router.push(`/presentation/${data.id}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundColor: primaryColor + '20',
          }}
          transition={{ duration: 0.5 }}
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <Link href="/">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
          >
            <span>←</span>
            <span>Back</span>
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Presentation</h1>
          <p className="text-foreground-muted mb-10">
            Brand your financial presentation for your client
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-8"
          >
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter the presenting company's name"
                className="w-full px-4 py-3 bg-background-secondary border border-white/10 rounded-xl text-foreground placeholder-foreground-subtle focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Logo
              </label>
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-brand bg-brand/10'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                {logoUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="max-h-24 max-w-48 object-contain mb-4"
                    />
                    <p className="text-sm text-foreground-muted">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-background-tertiary flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-foreground-subtle"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-foreground mb-1">
                      {isDragActive ? 'Drop your logo here' : 'Drag & drop your logo'}
                    </p>
                    <p className="text-sm text-foreground-subtle">
                      or click to browse (PNG, JPG, SVG up to 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Brand Color
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {presetColors.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setPrimaryColor(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      primaryColor === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-background'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground-muted">Custom:</span>
                <div className="relative">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                  />
                </div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setPrimaryColor(val)
                    }
                  }}
                  className="w-28 px-3 py-2 bg-background-secondary border border-white/10 rounded-lg text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Preview Card */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Preview
              </label>
              <motion.div
                layout
                className="glass rounded-2xl p-6 overflow-hidden"
                style={{ borderColor: primaryColor + '40' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-12 h-12 object-contain rounded-lg bg-white/10"
                    />
                  ) : (
                    <motion.div
                      layout
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {companyName[0] || '?'}
                    </motion.div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {companyName || 'Company Name'}
                    </h3>
                    <p className="text-sm text-foreground-subtle">Financial Update 2025</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-background-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: primaryColor }}
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 0 30px ${primaryColor}40`,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Presentation'
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
