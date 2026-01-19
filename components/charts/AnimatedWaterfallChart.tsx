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
  ReferenceLine,
} from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { getChartThemeColors } from '@/lib/color-utils'
import { WaterfallTooltip } from './ChartTooltip'

interface WaterfallData {
  name: string
  value: number
  type: 'positive' | 'negative' | 'total'
}

interface AnimatedWaterfallChartProps {
  data: WaterfallData[]
  height?: number
  positiveColor?: string
  negativeColor?: string
  totalColor?: string
}

export function AnimatedWaterfallChart({
  data,
  height = 300,
  positiveColor = '#10B981',
  negativeColor = '#EF4444',
  totalColor = '#3B82F6',
}: AnimatedWaterfallChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { themeMode } = useBrand()
  const themeColors = getChartThemeColors(themeMode)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Transform data for waterfall effect
  let cumulative = 0
  const transformedData = data.map((item) => {
    const start = item.type === 'total' ? 0 : cumulative
    const end = item.type === 'total' ? item.value : cumulative + item.value
    if (item.type !== 'total') {
      cumulative += item.value
    }
    return {
      name: item.name,
      value: Math.abs(item.value),
      start: Math.min(start, end),
      end: Math.max(start, end),
      type: item.type,
      original: item.value,
    }
  })

  const getColor = (type: string, value: number) => {
    if (type === 'total') return totalColor
    return value >= 0 ? positiveColor : negativeColor
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <BarChart
          data={transformedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            stroke={themeColors.axisStroke}
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={themeColors.axisStroke}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)} mkr`}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <WaterfallTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: String(label || ''),
                  value: Number(p.value),
                  payload: p.payload as Record<string, unknown>,
                }))}
                label={label ? String(label) : undefined}
              />
            )}
            cursor={{
              fill: themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
              radius: 4,
            }}
          />
          <ReferenceLine y={0} stroke={themeColors.referenceLineStroke} />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {transformedData.map((entry, index) => {
              const barColor = getColor(entry.type, entry.original)
              return (
                <Cell
                  key={index}
                  fill={barColor}
                  style={{
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
                    filter: activeIndex === index ? `drop-shadow(0 0 8px ${barColor}60)` : 'none',
                    transition: 'opacity 0.2s ease-out, filter 0.2s ease-out',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
