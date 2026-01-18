'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/charts'
import { SimulationPanel, SliderInput, SelectInput } from '@/components/ui'
import { HeadcountData, simulateHiring } from '@/lib/mockData'
import { useBrand } from '@/lib/brand-context'
import { getStatusColors } from '@/lib/color-utils'

interface HeadcountSlideProps {
  data: HeadcountData
  primaryColor: string
}

export function HeadcountSlide({ data, primaryColor }: HeadcountSlideProps) {
  const [selectedDept, setSelectedDept] = useState('Teknik')
  const [newHires, setNewHires] = useState(0)
  const [simOpen, setSimOpen] = useState(false)
  const { themeMode } = useBrand()
  const statusColors = getStatusColors(themeMode)

  const selectedDeptData = data.departments.find(d => d.name === selectedDept)
  const avgSalary = selectedDeptData?.avgSalary || 100000

  const simulatedData = newHires > 0
    ? simulateHiring(data, newHires, selectedDept, avgSalary)
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
          Teamet
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
          value={simulatedData.totalEmployees}
          className="text-4xl md:text-5xl font-bold text-foreground"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-foreground-muted mt-1"
        >
          Totalt antal anställda
        </motion.p>
      </motion.div>

      {/* Department breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-foreground-muted text-xs mb-4"
      >
        Fördelat på {data.departments.length} avdelningar
      </motion.div>

      {/* Department bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md space-y-2 mb-4"
      >
        {simulatedData.departments.map((dept, i) => (
          <motion.div
            key={dept.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="flex items-center gap-2"
          >
            <span className="w-16 text-[10px] text-foreground-muted text-right">{dept.name}</span>
            <div className="flex-1 h-6 bg-background-tertiary rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg flex items-center justify-end px-2"
                style={{ backgroundColor: dept.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(dept.count / simulatedData.totalEmployees) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
              >
                <span className="text-white text-[10px] font-medium">{dept.count}</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Cost per employee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <p className="text-lg font-bold text-foreground">{simulatedData.costPerEmployee.toLocaleString()} kr</p>
        <p className="text-xs text-foreground-muted">snitt kostnad per anställd / månad</p>
      </motion.div>

      {/* Simulation Panel - Fixed at bottom center */}
      <SimulationPanel
        title="Rekryteringssimulering"
        description="Se effekten av nyanställningar"
        isOpen={simOpen}
        onToggle={() => setSimOpen(!simOpen)}
      >
        <SelectInput
          label="Avdelning"
          value={selectedDept}
          onChange={setSelectedDept}
          options={data.departments.map(d => ({ value: d.name, label: d.name }))}
        />
        <SliderInput
          label="Nyanställningar"
          value={newHires}
          onChange={setNewHires}
          min={0}
          max={20}
          step={1}
          suffix=" personer"
        />
        {newHires > 0 && (
          <div 
            className="p-2 rounded-lg text-xs"
            style={{ backgroundColor: statusColors.dangerBg }}
          >
            <span className="text-foreground-muted">Extra Månadskostnad: </span>
            <span className="font-semibold" style={{ color: statusColors.danger }}>
              +{Math.round((newHires * avgSalary) / 12).toLocaleString()} kr
            </span>
          </div>
        )}
      </SimulationPanel>
    </div>
  )
}
