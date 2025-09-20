'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './Card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive?: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'border-gray-200 dark:border-gray-700',
  success: 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10',
  warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10',
  danger: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10',
  info: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const iconVariantClasses = {
  default: 'text-gray-500',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400'
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  size = 'md'
}: MetricCardProps) {
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
    return trend.isPositive !== false ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card className={cn(variantClasses[variant])} padding={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header avec titre et trend */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </p>
            {trend && (
              <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {trend.value > 0 && '+'}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>

          {/* Valeur principale */}
          <div className="space-y-1">
            <p className={cn(
              'font-bold text-gray-900 dark:text-white leading-none',
              size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
            )}>
              {formatValue(value)}
            </p>

            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {icon && (
          <div className={cn(
            'flex-shrink-0 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50',
            iconVariantClasses[variant]
          )}>
            <div className={cn(
              size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
            )}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}