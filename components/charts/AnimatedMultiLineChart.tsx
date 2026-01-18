'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { getChartThemeColors } from '@/lib/color-utils'
import { ChartTooltip } from './ChartTooltip'

interface LineConfig {
  key: string
  color: string
  name: string
  strokeDasharray?: string
  opacity?: number
}

interface AnimatedMultiLineChartProps {
  data: Record<string, unknown>[]
  xAxisKey: string
  lines: LineConfig[]
  height?: number
  showGrid?: boolean
  formatYAxis?: (value: number) => string
  formatTooltip?: (value: number) => string
}

export function AnimatedMultiLineChart({
  data,
  xAxisKey,
  lines,
  height = 300,
  formatYAxis = (v) => v.toString(),
  formatTooltip = (v) => v.toString(),
}: AnimatedMultiLineChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { themeMode } = useBrand()
  const themeColors = getChartThemeColors(themeMode)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Create a map from dataKey to line config for tooltip coloring
  const lineConfigMap = lines.reduce((acc, line) => {
    acc[line.key] = line
    return acc
  }, {} as Record<string, LineConfig>)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: lineConfigMap[String(p.dataKey)]?.name || String(p.dataKey),
                  value: Number(p.value),
                  color: lineConfigMap[String(p.dataKey)]?.color || '#3B82F6',
                  dataKey: String(p.dataKey),
                }))}
                label={label}
                formatValue={formatTooltip}
                showColorDot={true}
              />
            )}
            cursor={{
              stroke: themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '16px',
            }}
            formatter={(value) => (
              <span style={{ 
                color: themeMode === 'light' ? '#4b5563' : '#9ca3af',
                fontSize: '12px',
              }}>
                {value}
              </span>
            )}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              strokeDasharray={line.strokeDasharray}
              strokeOpacity={line.opacity || 1}
              dot={false}
              activeDot={{
                r: 6,
                fill: line.color,
                stroke: themeMode === 'light' ? '#fff' : '#111',
                strokeWidth: 2,
                style: {
                  filter: `drop-shadow(0 0 4px ${line.color}60)`,
                },
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
