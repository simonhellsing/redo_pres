'use client'

import { useBrand } from '@/lib/brand-context'

interface TooltipPayloadItem {
  name?: string
  value: number
  color?: string
  dataKey?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  formatValue?: (value: number) => string
  formatLabel?: (label: string) => string
  showColorDot?: boolean
  singleValue?: boolean
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue = (v) => v.toLocaleString(),
  formatLabel = (l) => l,
  showColorDot = true,
  singleValue = false,
}: ChartTooltipProps) {
  const { themeMode } = useBrand()
  const isLight = themeMode === 'light'

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const bgColor = isLight 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(17, 17, 17, 0.95)'
  const borderColor = isLight 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  const textColor = isLight ? '#1a1a1a' : '#fafafa'
  const mutedColor = isLight ? '#6b7280' : '#9ca3af'
  const shadowColor = isLight 
    ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
    : '0 4px 20px rgba(0, 0, 0, 0.5)'

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: shadowColor,
        backdropFilter: 'blur(8px)',
        minWidth: '120px',
      }}
    >
      {label && (
        <p
          style={{
            color: mutedColor,
            fontSize: '12px',
            fontWeight: 500,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {formatLabel(label)}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {showColorDot && !singleValue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: entry.color || '#3B82F6',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: mutedColor,
                    fontSize: '13px',
                  }}
                >
                  {entry.name || entry.dataKey}
                </span>
              </div>
            )}
            <span
              style={{
                color: textColor,
                fontSize: '14px',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface DonutTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  total?: number
}

export function DonutTooltip({
  active,
  payload,
  total = 0,
}: DonutTooltipProps) {
  const { themeMode } = useBrand()
  const isLight = themeMode === 'light'

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const entry = payload[0]
  const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0'

  const bgColor = isLight 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(17, 17, 17, 0.95)'
  const borderColor = isLight 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  const textColor = isLight ? '#1a1a1a' : '#fafafa'
  const mutedColor = isLight ? '#6b7280' : '#9ca3af'
  const shadowColor = isLight 
    ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
    : '0 4px 20px rgba(0, 0, 0, 0.5)'

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: shadowColor,
        backdropFilter: 'blur(8px)',
        minWidth: '140px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: entry.color || '#3B82F6',
          }}
        />
        <span
          style={{
            color: textColor,
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {entry.name}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
        <span
          style={{
            color: textColor,
            fontSize: '18px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {entry.value.toLocaleString()} kr
        </span>
        <span
          style={{
            color: mutedColor,
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  )
}

interface WaterfallTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

export function WaterfallTooltip({
  active,
  payload,
  label,
}: WaterfallTooltipProps) {
  const { themeMode } = useBrand()
  const isLight = themeMode === 'light'

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const entry = payload[0]
  const originalValue = (entry.payload as { original?: number })?.original ?? entry.value
  const type = (entry.payload as { type?: string })?.type ?? 'positive'
  const isPositive = originalValue >= 0

  const bgColor = isLight 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(17, 17, 17, 0.95)'
  const borderColor = isLight 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(255, 255, 255, 0.1)'
  const textColor = isLight ? '#1a1a1a' : '#fafafa'
  const mutedColor = isLight ? '#6b7280' : '#9ca3af'
  const shadowColor = isLight 
    ? '0 4px 20px rgba(0, 0, 0, 0.15)' 
    : '0 4px 20px rgba(0, 0, 0, 0.5)'
  
  const valueColor = type === 'total' 
    ? (isLight ? '#2563eb' : '#60a5fa')
    : isPositive 
      ? (isLight ? '#15803d' : '#4ade80')
      : (isLight ? '#b91c1c' : '#f87171')

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: shadowColor,
        backdropFilter: 'blur(8px)',
        minWidth: '140px',
      }}
    >
      <p
        style={{
          color: mutedColor,
          fontSize: '12px',
          fontWeight: 500,
          marginBottom: '6px',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {type !== 'total' && (
          <span style={{ color: valueColor, fontSize: '14px' }}>
            {isPositive ? '+' : '−'}
          </span>
        )}
        <span
          style={{
            color: valueColor,
            fontSize: '18px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.abs(originalValue).toLocaleString()} kr
        </span>
      </div>
    </div>
  )
}
