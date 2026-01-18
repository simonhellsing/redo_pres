'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { RunwayData, simulateBurnRate } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface RunwaySlideProps {
  data: RunwayData
  primaryColor: string
}

export function RunwaySlide({ data, primaryColor }: RunwaySlideProps) {
  const [burnRate, setBurnRate] = useState(data.monthlyBurn)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = burnRate !== data.monthlyBurn
    ? simulateBurnRate(data, burnRate)
    : data

  const getRunwayStatus = (months: number) => {
    if (months >= 18) return { label: 'Hälsosam', color: statusColors.success, bg: statusColors.successBg }
    if (months >= 12) return { label: 'Måttlig', color: statusColors.warning, bg: statusColors.warningBg }
    return { label: 'Kritisk', color: statusColors.danger, bg: statusColors.dangerBg }
  }

  const status = getRunwayStatus(simulatedData.runwayMonths)

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
          Kassalikviditet
        </span>
      </motion.div>

      {/* Main Metric */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-3 text-center"
      >
        <div className="flex items-baseline gap-2 justify-center">
          <AnimatedCounter
            value={simulatedData.runwayMonths}
            className="text-4xl md:text-5xl font-bold text-foreground"
          />
          <span className="text-xl md:text-2xl text-foreground-muted font-light">månader</span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Kvarvarande kassalikviditet
        </motion.p>
      </motion.div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="inline-flex px-2 py-1 rounded-full mb-4"
        style={{ backgroundColor: status.bg }}
      >
        <span className="text-xs font-semibold" style={{ color: status.color }}>{status.label}</span>
      </motion.div>

      {/* Visual runway bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md mb-4"
      >
        <div className="relative h-6 bg-background-tertiary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((simulatedData.runwayMonths / 24) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-foreground-subtle">
          <span>0</span>
          <span>12 månader</span>
          <span>24 månader</span>
        </div>
      </motion.div>

      {/* Key stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-6"
      >
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{(simulatedData.currentCash / 1000000).toFixed(1)} mkr</p>
          <p className="text-xs text-foreground-muted">Nuvarande kassa</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: statusColors.danger }}>{(simulatedData.monthlyBurn / 1000).toFixed(0)} tkr</p>
          <p className="text-xs text-foreground-muted">Månatlig kassaförbrukning</p>
        </div>
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Kassaförbrukning Simulering"
        description="Justera månatlig burn"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Månatlig kassaförbrukning"
          value={burnRate}
          onChange={setBurnRate}
          min={200000}
          max={800000}
          step={10000}
          suffix=" kr"
        />
        {burnRate !== data.monthlyBurn && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: burnRate < data.monthlyBurn ? statusColors.successBg : statusColors.dangerBg }}
          >
            <span className="text-foreground-muted">Förändring: </span>
            <span 
              className="font-semibold"
              style={{ color: burnRate < data.monthlyBurn ? statusColors.success : statusColors.danger }}
            >
              {simulatedData.runwayMonths > data.runwayMonths ? '+' : ''}
              {simulatedData.runwayMonths - data.runwayMonths} månader
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
