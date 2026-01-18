'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedDonutChart, AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput, SelectInput } from '@/components/ui'
import { ExpenseData, simulateExpenseReduction } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface ExpenseSlideProps {
  data: ExpenseData
  primaryColor: string
}

export function ExpenseSlide({ data, primaryColor }: ExpenseSlideProps) {
  const [selectedCategory, setSelectedCategory] = useState(data.categories[0].name)
  const [reduction, setReduction] = useState(0)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = reduction !== 0
    ? simulateExpenseReduction(data, selectedCategory, reduction)
    : data

  const chartData = simulatedData.categories.map(c => ({
    name: c.name,
    value: c.amount,
    color: c.color,
  }))

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
          Kostnader
        </span>
      </motion.div>

      {/* Main Metric */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-2 text-center"
      >
        <AnimatedCounter
          value={simulatedData.totalExpenses}
          suffix=" kr"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Totala årliga kostnader
        </motion.p>
      </motion.div>

      {/* Monthly average */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-foreground-muted text-xs mb-4"
      >
        ~{Math.round(simulatedData.totalExpenses / 12).toLocaleString()} kr / månad
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-4 w-full max-w-sm"
      >
        <AnimatedDonutChart
          data={chartData}
          height={200}
          innerRadius={50}
          outerRadius={90}
        />
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {simulatedData.categories.slice(0, 4).map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-[10px] text-foreground-muted">{cat.name}</span>
            <span className="text-[10px] font-medium text-foreground">{cat.percentage}%</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Kostnadsreducering"
        description="Se effekten av att minska kostnader"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SelectInput
          label="Kategori"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={data.categories.map(c => ({ value: c.name, label: c.name }))}
        />
        <SliderInput
          label="Minskning"
          value={reduction}
          onChange={setReduction}
          min={0}
          max={50}
          step={5}
          suffix="%"
        />
        {reduction > 0 && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: statusColors.successBg }}
          >
            <span className="text-foreground-muted">Årlig Besparing: </span>
            <span className="font-semibold" style={{ color: statusColors.success }}>
              {(data.totalExpenses - simulatedData.totalExpenses).toLocaleString()} kr
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
