'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedMultiLineChart, AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { ProjectionsData, simulateGrowthRate } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface ProjectionsSlideProps {
  data: ProjectionsData
  primaryColor: string
  chartColors: string[]
}

export function ProjectionsSlide({ data, primaryColor, chartColors }: ProjectionsSlideProps) {
  const [growthRate, setGrowthRate] = useState(data.assumptions.baseGrowth)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = growthRate !== data.assumptions.baseGrowth
    ? simulateGrowthRate(data, growthRate)
    : data

  // Combine scenarios for chart
  const chartData = simulatedData.scenarios.base.map((base, index) => ({
    month: base.month,
    conservative: simulatedData.scenarios.conservative[index].revenue,
    base: base.revenue,
    optimistic: simulatedData.scenarios.optimistic[index].revenue,
  }))

  const projectedARR = simulatedData.scenarios.base[simulatedData.scenarios.base.length - 1].revenue * 12

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
          Prognos
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
          value={projectedARR}
          suffix=" kr"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Projicerad ARR (6 månader)
        </motion.p>
      </motion.div>

      {/* Growth assumption */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-4"
      >
        <span className="text-foreground-muted text-xs">vid</span>
        <div className="px-2 py-1 rounded-full" style={{ backgroundColor: primaryColor + '20' }}>
          <span className="text-xs font-semibold" style={{ color: primaryColor }}>
            {simulatedData.assumptions.baseGrowth}% årlig tillväxt
          </span>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-2xl mb-4"
      >
        <AnimatedMultiLineChart
          data={chartData}
          xAxisKey="month"
          lines={[
            { key: 'conservative', color: chartColors[2] || '#F59E0B', name: 'Konservativt', strokeDasharray: '5 5', opacity: 0.6 },
            { key: 'base', color: primaryColor, name: 'Basfall' },
            { key: 'optimistic', color: chartColors[1] || '#10B981', name: 'Optimistiskt', strokeDasharray: '5 5', opacity: 0.6 },
          ]}
          height={200}
          showGrid={false}
          formatYAxis={(v) => `${(v / 1000000).toFixed(1)} mkr`}
          formatTooltip={(v) => `${v.toLocaleString()} kr`}
        />
      </motion.div>

      {/* Scenario comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4"
      >
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: chartColors[2] || '#F59E0B' }}>
            {(simulatedData.scenarios.conservative[5].revenue * 12 / 1000000).toFixed(1)} mkr
          </p>
          <p className="text-[10px] text-foreground-muted">Konservativt</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: primaryColor }}>
            {(projectedARR / 1000000).toFixed(1)} mkr
          </p>
          <p className="text-[10px] text-foreground-muted">Basfall</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold" style={{ color: chartColors[1] || '#10B981' }}>
            {(simulatedData.scenarios.optimistic[5].revenue * 12 / 1000000).toFixed(1)} mkr
          </p>
          <p className="text-[10px] text-foreground-muted">Optimistiskt</p>
        </div>
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Tillväxtsimulering"
        description="Justera tillväxtantagande"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Årlig Tillväxttakt"
          value={growthRate}
          onChange={setGrowthRate}
          min={10}
          max={100}
          step={5}
          suffix="%"
        />
        {growthRate !== data.assumptions.baseGrowth && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: growthRate > data.assumptions.baseGrowth ? statusColors.successBg : statusColors.warningBg }}
          >
            <span className="text-foreground-muted">Projicerad ARR: </span>
            <span 
              className="font-semibold"
              style={{ color: growthRate > data.assumptions.baseGrowth ? statusColors.success : statusColors.warning }}
            >
              {(projectedARR / 1000000).toFixed(1)} mkr
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
