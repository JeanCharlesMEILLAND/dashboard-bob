'use client'

import { useState } from 'react'
import {
  BarChart3, Users, Activity, Database, Cpu, Shield,
  Settings, Bell, Terminal, Server, Globe, Zap,
  ChevronLeft, ChevronRight, Home, TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  mode: 'data' | 'devops'
  collapsed: boolean
  onToggleCollapse: () => void
}

const dataMenuItems = [
  { icon: Home, label: 'Vue d\'ensemble', active: true },
  { icon: Users, label: 'Utilisateurs', count: 273 },
  { icon: TrendingUp, label: 'Analytics' },
  { icon: BarChart3, label: 'Revenus' },
  { icon: Globe, label: 'Engagement' },
  { icon: Activity, label: 'Conversions' }
]

const devopsMenuItems = [
  { icon: Home, label: 'Vue d\'ensemble', active: true },
  { icon: Server, label: 'Serveurs', status: 'online' },
  { icon: Cpu, label: 'Ressources' },
  { icon: Database, label: 'Bases de données' },
  { icon: Terminal, label: 'Logs', alert: true },
  { icon: Shield, label: 'Sécurité', count: 3 },
  { icon: Zap, label: 'Alertes' }
]

export default function Sidebar({ mode, collapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = mode === 'data' ? dataMenuItems : devopsMenuItems

  return (
    <aside className={cn(
      'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 h-6 w-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <div className="p-4 space-y-2">
        {/* Mode indicator */}
        {!collapsed && (
          <div className="mb-6">
            <div className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium',
              mode === 'data'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            )}>
              {mode === 'data' ? '📊' : '⚙️'}
              {mode === 'data' ? 'Mode Data' : 'Mode DevOps'}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                  item.active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                  collapsed ? 'justify-center' : ''
                )}
              >
                <div className="relative flex-shrink-0">
                  <Icon className="h-5 w-5" />
                  {/* Status indicators */}
                  {item.status === 'online' && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full"></span>
                  )}
                  {item.alert && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-400 rounded-full animate-pulse"></span>
                  )}
                </div>

                {!collapsed && (
                  <>
                    <span className="font-medium truncate">{item.label}</span>
                    {/* Badges */}
                    {item.count && (
                      <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom section */}
        {!collapsed && (
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Paramètres</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="font-medium">Notifications</span>
                <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full">
                  3
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}