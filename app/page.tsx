'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Presentation {
  id: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  customerCompanyName: string
  customerLogoUrl: string | null
  presentationTitle: string
  createdAt: string
}

export default function Home() {
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Learnster presentation and redirect to it
    fetch('/api/presentations/init', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          router.push(`/presentation/${data.id}`)
        }
      })
      .catch((error) => {
        console.error('Error initializing presentation:', error)
        // Fall back to showing the list if initialization fails
        fetch('/api/presentations')
          .then(res => res.json())
          .then(data => {
            setPresentations(data)
            setLoading(false)
          })
          .catch(() => setLoading(false))
      })
  }, [router])

  const handleCopyLink = async (e: React.MouseEvent, presentationId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/share/${presentationId}`
    await navigator.clipboard.writeText(url)
    setCopiedId(presentationId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Presentations</h1>
            <p className="text-foreground-muted mt-1">Manage your financial presentations</p>
          </div>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-brand rounded-xl text-white font-semibold shadow-lg transition-all hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Presentation
            </motion.button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && presentations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-background-secondary flex items-center justify-center">
              <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No presentations yet</h2>
            <p className="text-foreground-muted mb-8">Create your first financial presentation to get started.</p>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-brand rounded-xl text-white font-semibold"
              >
                Create Presentation
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Presentations List */}
        {!loading && presentations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {presentations.map((pres, i) => (
              <motion.div
                key={pres.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-5 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Customer Logo/Avatar */}
                  <div className="flex-shrink-0">
                    {pres.customerLogoUrl ? (
                      <img
                        src={pres.customerLogoUrl}
                        alt={pres.customerCompanyName}
                        className="w-12 h-12 rounded-xl object-contain bg-white/10"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: pres.primaryColor }}
                      >
                        {pres.customerCompanyName[0]}
                      </div>
                    )}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground truncate">
                        {pres.customerCompanyName}
                      </h3>
                      <span className="text-foreground-subtle text-sm hidden sm:inline">
                        {pres.presentationTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        {pres.logoUrl ? (
                          <img src={pres.logoUrl} alt={pres.companyName} className="h-4 object-contain" />
                        ) : (
                          <span className="text-xs text-foreground-subtle">{pres.companyName}</span>
                        )}
                      </div>
                      <span className="text-foreground-subtle text-xs">•</span>
                      <span className="text-foreground-subtle text-xs">{formatDate(pres.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleCopyLink(e, pres.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-foreground-muted hover:text-foreground"
                      title="Copy share link"
                    >
                      {copiedId === pres.id ? (
                        <>
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-400 hidden sm:inline">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span className="hidden sm:inline">Share</span>
                        </>
                      )}
                    </button>
                    
                    <Link href={`/create?edit=${pres.id}`}>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-foreground-muted hover:text-foreground"
                        title="Edit settings"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden sm:inline">Settings</span>
                      </button>
                    </Link>

                    <Link href={`/presentation/${pres.id}`}>
                      <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors text-sm font-medium text-white"
                        style={{ backgroundColor: pres.primaryColor }}
                      >
                        <span>View</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Toast notification */}
        <AnimatePresence>
          {copiedId && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-full glass text-sm text-foreground flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Share link copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
