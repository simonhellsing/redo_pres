'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { getChartThemeColors } from '@/lib/color-utils'

interface StackedBarData {
  name: string
  [key: string]: string | number
}

interface AnimatedStackedBarChartProps {
  data: StackedBarData[]
  keys: { key: string; color: string; name: string }[]
  height?: number
  formatYAxis?: (value: number) => string
}

export function AnimatedStackedBarChart({
  data,
  keys,
  height = 300,
  formatYAxis = (v) => v.toString(),
}: AnimatedStackedBarChartProps) {
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
            contentStyle={{
              backgroundColor: themeColors.tooltipBackground,
              border: themeColors.tooltipBorder,
              borderRadius: '8px',
              color: themeColors.tooltipText,
            }}
          />
          <Legend />
          {keys.map((k) => (
            <Bar
              key={k.key}
              dataKey={k.key}
              name={k.name}
              stackId="a"
              fill={k.color}
              radius={[0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
