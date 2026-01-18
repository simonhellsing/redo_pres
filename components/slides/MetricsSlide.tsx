'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { MetricsData, simulateChurnImprovement } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface MetricsSlideProps {
  data: MetricsData
  primaryColor: string
}

export function MetricsSlide({ data, primaryColor }: MetricsSlideProps) {
  const [churnImprovement, setChurnImprovement] = useState(0)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = churnImprovement > 0
    ? simulateChurnImprovement(data, churnImprovement)
    : data

  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 md:px-16 pt-16 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3"
      >
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: primaryColor }}>
          Enhetsekonomi
        </span>
      </motion.div>

      {/* Main Metric - LTV:CAC */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-3 text-center"
      >
        <div className="flex items-baseline gap-2 justify-center">
          <AnimatedCounter
            value={simulatedData.ltvCacRatio}
            decimals={1}
            className="text-4xl md:text-5xl font-bold text-foreground"
          />
          <span className="text-2xl md:text-3xl text-foreground-muted font-light">x</span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          LTV till CAC ratio
        </motion.p>
      </motion.div>

      {/* Benchmark indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ backgroundColor: simulatedData.ltvCacRatio >= 3 ? statusColors.successBg : statusColors.warningBg }}
        >
          <svg 
            className="w-3 h-3" 
            style={{ color: simulatedData.ltvCacRatio >= 3 ? statusColors.success : statusColors.warning }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span 
            className="text-xs font-semibold"
            style={{ color: simulatedData.ltvCacRatio >= 3 ? statusColors.success : statusColors.warning }}
          >
            {simulatedData.ltvCacRatio >= 3 ? 'Hälsosam' : 'Behöver Förbättras'}
          </span>
        </div>
        <span className="text-foreground-muted text-[10px]">riktmärke: 3x+</span>
      </motion.div>

      {/* Supporting metrics grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 gap-3 max-w-md"
      >
        {[
          { label: 'LTV', value: `${simulatedData.ltv.toLocaleString()} kr`, desc: 'Livstidsvärde' },
          { label: 'CAC', value: `${simulatedData.cac.toLocaleString()} kr`, desc: 'Förvärvskostnad' },
          { label: 'Kundbortfall', value: `${simulatedData.churnRate}%`, desc: 'Månatlig' },
          { label: 'NRR', value: `${simulatedData.nrr}%`, desc: 'Nettobehållning' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass rounded-lg p-3"
          >
            <p className="text-lg font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-foreground-muted">{metric.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Kundbortfallsförbättring"
        description="Se effekten av att minska kundbortfall"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Minskat kundbortfall"
          value={churnImprovement}
          onChange={setChurnImprovement}
          min={0}
          max={50}
          step={5}
          suffix="%"
        />
        {churnImprovement > 0 && (
          <div 
            className="p-2 rounded-lg text-xs space-y-1"
            style={{ backgroundColor: statusColors.successBg }}
          >
            <div>
              <span className="text-foreground-muted">Ny LTV: </span>
              <span className="font-semibold" style={{ color: statusColors.success }}>{simulatedData.ltv.toLocaleString()} kr</span>
            </div>
            <div>
              <span className="text-foreground-muted">Ny LTV:CAC: </span>
              <span className="font-semibold" style={{ color: statusColors.success }}>{simulatedData.ltvCacRatio}x</span>
            </div>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
