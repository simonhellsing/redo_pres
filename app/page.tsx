'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Presentation {
  id: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  createdAt: string
}

export default function Home() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/presentations')
      .then(res => res.json())
      .then(data => {
        setPresentations(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full glass text-sm text-foreground-muted">
                Financial Presentations, Reimagined
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Present </span>
              <span className="text-gradient-brand">Financial Data</span>
              <br />
              <span className="text-foreground">Like Never Before</span>
            </h1>
            
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
              Create stunning, interactive financial presentations branded for your clients.
              Simulate scenarios in real-time. Share with a single link.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-brand rounded-xl text-white font-semibold text-lg shadow-lg glow-brand transition-all hover:shadow-xl"
                >
                  Create Presentation
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-24"
          >
            {[
              {
                title: 'Beautiful Charts',
                description: 'Stunning visualizations that animate and engage your audience.',
                icon: '📊',
              },
              {
                title: 'Real-time Simulations',
                description: 'What-if scenarios that update instantly as you adjust parameters.',
                icon: '🔮',
              },
              {
                title: 'Custom Branding',
                description: 'Your logo, your colors. Every presentation feels uniquely yours.',
                icon: '🎨',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground-muted">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Recent Presentations */}
        {!loading && presentations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="max-w-6xl mx-auto px-6 py-16"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-8">Recent Presentations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentations.slice(0, 6).map((pres, i) => (
                <motion.div
                  key={pres.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }}
                >
                  <Link href={`/presentation/${pres.id}`}>
                    <div
                      className="glass rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group"
                      style={{ borderColor: pres.primaryColor + '40' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {pres.logoUrl ? (
                          <img
                            src={pres.logoUrl}
                            alt={pres.companyName}
                            className="w-10 h-10 rounded-lg object-contain bg-white/10"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: pres.primaryColor }}
                          >
                            {pres.companyName[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-brand-light transition-colors">
                            {pres.companyName}
                          </h3>
                          <p className="text-xs text-foreground-subtle">
                            {new Date(pres.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: pres.primaryColor + '20', color: pres.primaryColor }}
                        >
                          8 slides
                        </span>
                        <span className="text-foreground-subtle text-sm group-hover:text-foreground-muted transition-colors">
                          View →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
