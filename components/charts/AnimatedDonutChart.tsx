'use client'

import { useEffect, useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts'
import { motion } from 'framer-motion'
import { useBrand } from '@/lib/brand-context'
import { DonutTooltip } from './ChartTooltip'

interface AnimatedDonutChartProps {
  data: { name: string; value: number; color: string }[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export function AnimatedDonutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
}: AnimatedDonutChartProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { themeMode } = useBrand()

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const renderActiveShape = (props: unknown) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props as {
      cx: number
      cy: number
      innerRadius: number
      outerRadius: number
      startAngle: number
      endAngle: number
      fill: string
    }

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: `drop-shadow(0 0 12px ${fill}80)`,
            transition: 'all 0.2s ease-out',
          }}
        />
      </g>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            stroke="none"
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                style={{
                  filter: activeIndex === null || activeIndex === index 
                    ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))'
                    : 'none',
                  opacity: activeIndex === null || activeIndex === index ? 1 : 0.4,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease-out',
                }}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => (
              <DonutTooltip
                active={active}
                payload={payload?.map(p => ({
                  name: String(p.name || ''),
                  value: Number(p.value),
                  color: String((p.payload as { color?: string })?.color || '#3B82F6'),
                }))}
                total={total}
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
