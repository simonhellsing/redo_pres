'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { getChartThemeColors } from '@/lib/color-utils'
import { ChartTooltip } from './ChartTooltip'

interface AnimatedBarChartProps {
  data: { name: string; value: number; color?: string }[]
  height?: number
  color?: string
  formatYAxis?: (value: number) => string
  formatTooltip?: (value: number) => string
}

export function AnimatedBarChart({
  data,
  height = 300,
  color = '#3B82F6',
  formatYAxis = (v) => v.toString(),
  formatTooltip = (v) => v.toString(),
}: AnimatedBarChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { themeMode } = useBrand()
  const themeColors = getChartThemeColors(themeMode)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
            stroke={themeColors.axisStroke}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={themeColors.axisStroke}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: String(label || ''),
                  value: Number(p.value),
                  color: String((p.payload as { color?: string })?.color || color),
                }))}
                label={label}
                formatValue={formatTooltip}
                singleValue={true}
              />
            )}
            cursor={{
              fill: themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
              radius: 4,
            }}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color || color}
                style={{
                  opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
                  filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color || color}60)` : 'none',
                  transition: 'opacity 0.2s ease-out, filter 0.2s ease-out',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
