'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'glass' | 'gradient' | 'bordered'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
}

const variantClasses = {
  default: 'bg-white dark:bg-gray-800  shadow-sm',
  glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm  shadow-lg',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900  shadow-md',
  bordered: 'bg-white dark:bg-gray-800  shadow-sm'
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  variant = 'default'
}: CardProps) {
  return (
    <div className={cn(
      'transition-all duration-200 hover:shadow-md',
      variantClasses[variant],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}