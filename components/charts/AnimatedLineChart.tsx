'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { getChartThemeColors } from '@/lib/color-utils'
import { ChartTooltip } from './ChartTooltip'

interface AnimatedLineChartProps {
  data: Record<string, unknown>[]
  dataKey: string
  xAxisKey: string
  color?: string
  height?: number
  showGrid?: boolean
  formatYAxis?: (value: number) => string
  formatTooltip?: (value: number) => string
}

export function AnimatedLineChart({
  data,
  dataKey,
  xAxisKey,
  color = '#3B82F6',
  height = 300,
  showGrid = true,
  formatYAxis = (v) => v.toString(),
  formatTooltip = (v) => v.toString(),
}: AnimatedLineChartProps) {
  const [isVisible, setIsVisible] = useState(false)
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
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}
              vertical={true}
              horizontal={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
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
            orientation="left"
            width={85}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: String(p.name || ''),
                  value: Number(p.value),
                  color: color,
                }))}
                label={label}
                formatValue={formatTooltip}
                singleValue={true}
              />
            )}
            cursor={{
              stroke: themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 8,
              fill: color,
              stroke: themeMode === 'light' ? '#fff' : '#111',
              strokeWidth: 3,
              style: {
                filter: `drop-shadow(0 0 6px ${color}80)`,
              },
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
