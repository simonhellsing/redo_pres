'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SimulationPanelProps {
  title: string
  description: string
  children: ReactNode
  isOpen?: boolean
  onToggle?: () => void
}

export function SimulationPanel({
  title,
  description,
  children,
  isOpen = true,
  onToggle,
}: SimulationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground-muted">{description}</p>
          </div>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-foreground-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
  prefix?: string
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  prefix = '',
}: SliderInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-foreground-muted">{label}</span>
        <span className="text-sm font-medium text-foreground">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-brand"
        style={{
          background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${((value - min) / (max - min)) * 100}%, var(--background-tertiary) ${((value - min) / (max - min)) * 100}%, var(--background-tertiary) 100%)`,
        }}
      />
    </div>
  )
}

interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

export function SelectInput({ label, value, onChange, options }: SelectInputProps) {
  return (
    <div>
      <label className="block text-sm text-foreground-muted mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background-tertiary border border-white/10 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
