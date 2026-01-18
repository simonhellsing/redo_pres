'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedLineChart, AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { RevenueData, simulateRevenueGrowth } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface RevenueSlideProps {
  data: RevenueData
  primaryColor: string
}

export function RevenueSlide({ data, primaryColor }: RevenueSlideProps) {
  const [growthAdjustment, setGrowthAdjustment] = useState(0)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)
  
  const simulatedData = growthAdjustment !== 0 
    ? simulateRevenueGrowth(data, growthAdjustment)
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
          Intäkter
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
          value={simulatedData.arr}
          suffix=" kr"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Årlig återkommande intäkt
        </motion.p>
      </motion.div>

      {/* Growth indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ backgroundColor: statusColors.successBg }}
        >
          <svg className="w-3 h-3" style={{ color: statusColors.success }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: statusColors.success }}>+{simulatedData.yoyGrowth}%</span>
        </div>
        <span className="text-foreground-muted text-xs">jämfört med förra året</span>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        <AnimatedLineChart
          data={simulatedData.monthly}
          dataKey="revenue"
          xAxisKey="month"
          color={primaryColor}
          height={200}
          showGrid={true}
          formatYAxis={(v) => `${(v / 1000).toFixed(0)} tkr`}
          formatTooltip={(v) => `${v.toLocaleString()} kr`}
        />
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Tillväxt simulering"
        description="Justera tillväxttakt"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Ytterligare Tillväxt"
          value={growthAdjustment}
          onChange={setGrowthAdjustment}
          min={-50}
          max={100}
          step={5}
          suffix="%"
          prefix={growthAdjustment >= 0 ? '+' : ''}
        />
        {growthAdjustment !== 0 && (
          <div className="p-2 rounded-lg bg-brand/10 text-xs">
            <span className="text-foreground-muted">Ny ARR: </span>
            <span className="font-semibold text-foreground">{simulatedData.arr.toLocaleString()} kr</span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
