'use client'

import { ReactNode, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, MoreHorizontal, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive?: boolean
    timeframe?: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  gradient?: boolean
  sparkline?: number[]
  showMenu?: boolean
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-gray-900',
    gradient: 'from-gray-50 to-white dark:from-gray-800 dark:to-gray-900'
  },
  success: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    gradient: 'from-green-400 to-emerald-500'
  },
  warning: {
    bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    gradient: 'from-yellow-400 to-orange-500'
  },
  danger: {
    bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    gradient: 'from-red-400 to-rose-500'
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    gradient: 'from-blue-400 to-cyan-500'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
    gradient: 'from-purple-400 to-violet-500'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
    gradient: 'from-indigo-400 to-blue-500'
  }
}

const iconVariantColors = {
  default: 'text-gray-500',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  indigo: 'text-indigo-600 dark:text-indigo-400'
}

export default function MetricCardPro({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  animated = true,
  gradient = false,
  sparkline,
  showMenu = false
}: MetricCardProProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('fr-FR').format(val)
    }
    return val
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value === 0) return <Minus className="h-4 w-4" />
    return trend.isPositive !== false
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendColor = () => {
    if (!trend) return ''
    if (trend.value === 0) return 'text-gray-500'
    return trend.isPositive !== false ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'relative overflow-hidden p-6 backdrop-blur-sm transition-all duration-300',
        styles.bg,
        animated && 'hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-1',
        sizeClasses[size],
        'group cursor-pointer'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-300',
          styles.gradient,
          isHovered ? 'opacity-10' : 'opacity-5'
        )} />
      )}

      {/* Sparkline background */}
      {sparkline && (
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={sparkline.map((val, idx) => `${idx * (100 / (sparkline.length - 1))},${50 - (val * 40)}`).join(' ')}
              className={iconVariantColors[variant]}
            />
          </svg>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider truncate">
                {title}
              </p>
              {showMenu && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 lg shadow-lg  -gray-200 dark:-gray-700 z-20">
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                          <RefreshCw className="h-4 w-4" />
                          Actualiser
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {icon && (
            <div className={cn(
              'flex-shrink-0 p-3 xl transition-all duration-300',
              'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm',
              iconVariantColors[variant],
              animated && isHovered && 'scale-110 rotate-6'
            )}>
              <div className={iconSizes[size]}>
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <p className={cn(
              'font-bold text-gray-900 dark:text-white leading-none',
              textSizes[size],
              animated && 'transition-all duration-300'
            )}>
              {animated && isHovered ? (
                <span className="inline-block animate-pulse">
                  {formatValue(value)}
                </span>
              ) : (
                formatValue(value)
              )}
            </p>

            {trend && (
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 full text-xs font-semibold',
                'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                getTrendColor(),
                animated && 'transition-all duration-300 hover:scale-105'
              )}>
                {getTrendIcon()}
                <span>
                  {trend.value > 0 && '+'}
                  {trend.value}%
                </span>
                {trend.timeframe && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {trend.timeframe}
                  </span>
                )}
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress bar si c'est un pourcentage */}
        {typeof value === 'string' && value.includes('%') && (
          <div className="mt-4">
            <div className="bg-gray-200 dark:bg-gray-700 full h-2 overflow-hidden">
              <div
                className={cn(
                  'h-full full transition-all duration-1000 bg-gradient-to-r',
                  styles.gradient,
                  animated && isHovered && 'animate-pulse'
                )}
                style={{
                  width: `${Math.min(parseInt(value), 100)}%`,
                  transitionDelay: animated ? '200ms' : '0ms'
                }}
              />
            </div>
          </div>
        )}

        {/* Animation overlay */}
        {animated && isHovered && (
          <div className="absolute inset-0 bg-white/5 dark:bg-gray-800/5 2xl animate-pulse" />
        )}
      </div>
    </div>
  )
}