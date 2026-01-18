'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedWaterfallChart, AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { PLData, simulateGrossMargin } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface PLSlideProps {
  data: PLData
  primaryColor: string
  chartColors: string[]
}

export function PLSlide({ data, primaryColor, chartColors }: PLSlideProps) {
  const [grossMargin, setGrossMargin] = useState(data.grossMargin)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = grossMargin !== data.grossMargin
    ? simulateGrossMargin(data, grossMargin)
    : data

  const isProfitable = simulatedData.netIncome >= 0

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
          Resultaträkning
        </span>
      </motion.div>

      {/* Main Metric */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-3 text-center"
      >
        <AnimatedCounter
          value={Math.abs(simulatedData.netIncome)}
          prefix={isProfitable ? '' : '-'}
          suffix=" kr"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Nettoresultat
        </motion.p>
      </motion.div>

      {/* Profitability badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="inline-flex px-2 py-1 rounded-full mb-4"
        style={{ backgroundColor: isProfitable ? statusColors.successBg : statusColors.dangerBg }}
      >
        <span 
          className="text-xs font-semibold"
          style={{ color: isProfitable ? statusColors.success : statusColors.danger }}
        >
          {isProfitable ? 'Lönsam' : 'Förlustbringande'}
        </span>
      </motion.div>

      {/* Waterfall chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-2xl mb-4"
      >
        <AnimatedWaterfallChart
          data={simulatedData.waterfall}
          height={200}
          positiveColor={chartColors[1] || '#10B981'}
          negativeColor={chartColors[3] || '#EF4444'}
          totalColor={primaryColor}
        />
      </motion.div>

      {/* Key figures */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-6"
      >
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{(simulatedData.revenue / 1000000).toFixed(1)} mkr</p>
          <p className="text-xs text-foreground-muted">Intäkter</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{simulatedData.grossMargin}%</p>
          <p className="text-xs text-foreground-muted">Bruttomarginal</p>
        </div>
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Marginalsimulering"
        description="Justera bruttomarginal"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Bruttomarginal"
          value={grossMargin}
          onChange={setGrossMargin}
          min={50}
          max={95}
          step={1}
          suffix="%"
        />
        {grossMargin !== data.grossMargin && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: simulatedData.netIncome > data.netIncome ? statusColors.successBg : statusColors.dangerBg }}
          >
            <span className="text-foreground-muted">Förändring Nettoresultat: </span>
            <span 
              className="font-semibold"
              style={{ color: simulatedData.netIncome > data.netIncome ? statusColors.success : statusColors.danger }}
            >
              {simulatedData.netIncome > data.netIncome ? '+' : ''}
              {((simulatedData.netIncome - data.netIncome) / 1000000).toFixed(1)} mkr
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
