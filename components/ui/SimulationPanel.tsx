'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SimulationPanelProps {
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export function SimulationPanel({
  title,
  description,
  isOpen,
  onToggle,
  children,
}: SimulationPanelProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <motion.div
        className="glass rounded-xl overflow-hidden"
        layout
      >
        <button
          onClick={onToggle}
          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors"
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--brand-primary, #3B82F6)' }}
          >
            <svg
              className="w-3 h-3 text-white"
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
          <div className="flex-1 text-left">
            <p className="text-xs font-medium text-foreground">{title}</p>
            <p className="text-[10px] text-foreground-muted">{description}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-4 h-4 text-foreground-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-3 border-t border-white/10">
                <div className="pt-3">{children}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  prefix?: string
  suffix?: string
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
}: SliderInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-foreground-muted">{label}</span>
        <span className="font-medium text-foreground">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-background-tertiary rounded-full appearance-none cursor-pointer accent-brand"
        style={{ accentColor: 'var(--brand-primary, #3B82F6)' }}
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
    <div className="space-y-1">
      <label className="text-xs text-foreground-muted">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 bg-background-tertiary rounded-lg text-xs text-foreground border border-white/10 focus:outline-none focus:border-brand"
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
