'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
  formatNumber?: boolean
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2,
  className = '',
  formatNumber = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const startValue = 0
    const endValue = value

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isInView, value, duration])

  const formattedValue = formatNumber
    ? displayValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : displayValue.toFixed(decimals)

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  )
}
