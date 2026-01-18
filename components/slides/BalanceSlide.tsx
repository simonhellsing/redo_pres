'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput } from '@/components/ui'
import { BalanceData, simulateFundraising } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface BalanceSlideProps {
  data: BalanceData
  primaryColor: string
}

export function BalanceSlide({ data, primaryColor }: BalanceSlideProps) {
  const [fundraiseAmount, setFundraiseAmount] = useState(0)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const simulatedData = fundraiseAmount > 0
    ? simulateFundraising(data, fundraiseAmount)
    : data

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} mkr`
    }
    return `${(value / 1000).toFixed(0)} tkr`
  }

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
          Balansräkning
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
          value={simulatedData.totalEquity}
          suffix=" kr"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Totalt eget kapital
        </motion.p>
      </motion.div>

      {/* Debt ratio */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-foreground-muted text-xs mb-4"
      >
        Skuldgrad: {((simulatedData.totalLiabilities / simulatedData.totalAssets) * 100).toFixed(0)}%
      </motion.div>

      {/* Balance equation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{formatCurrency(simulatedData.totalAssets)}</p>
          <p className="text-[10px] text-foreground-muted mt-1">Tillgångar</p>
        </div>
        
        <span className="text-lg text-foreground-muted">=</span>
        
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: statusColors.danger }}>{formatCurrency(simulatedData.totalLiabilities)}</p>
          <p className="text-[10px] text-foreground-muted mt-1">Skulder</p>
        </div>
        
        <span className="text-lg text-foreground-muted">+</span>
        
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: statusColors.success }}>{formatCurrency(simulatedData.totalEquity)}</p>
          <p className="text-[10px] text-foreground-muted mt-1">Eget Kapital</p>
        </div>
      </motion.div>

      {/* Visual bar comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="h-8 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full flex items-center justify-center"
            style={{ backgroundColor: statusColors.danger }}
            initial={{ width: 0 }}
            animate={{ width: `${(simulatedData.totalLiabilities / simulatedData.totalAssets) * 100}%` }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <span className="text-white text-[10px] font-medium px-2">Skulder</span>
          </motion.div>
          <motion.div
            className="h-full flex items-center justify-center"
            style={{ backgroundColor: statusColors.success }}
            initial={{ width: 0 }}
            animate={{ width: `${(simulatedData.totalEquity / simulatedData.totalAssets) * 100}%` }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <span className="text-white text-[10px] font-medium px-2">Eget Kapital</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Finansieringssimulering"
        description="Se effekten av kapitalanskaffning"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SliderInput
          label="Finansieringsbelopp"
          value={fundraiseAmount}
          onChange={setFundraiseAmount}
          min={0}
          max={20000000}
          step={1000000}
          suffix=" kr"
        />
        {fundraiseAmount > 0 && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: statusColors.successBg }}
          >
            <span className="text-foreground-muted">Ny Kassaposition: </span>
            <span className="font-semibold" style={{ color: statusColors.success }}>
              {formatCurrency(simulatedData.assets.cash)}
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
