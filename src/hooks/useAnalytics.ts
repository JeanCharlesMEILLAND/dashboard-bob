'use client'

import { useState, useEffect } from 'react'

// Types pour les analytics
export interface AnalyticsReport {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  format: 'pdf' | 'csv' | 'excel' | 'json'
  status: 'generated' | 'generating' | 'failed' | 'scheduled'
  createdAt: string
  size: number
  downloadUrl?: string
  metrics: string[]
  period: {
    start: string
    end: string
  }
}

export interface KPIMetric {
  id: string
  name: string
  value: number
  previousValue: number
  target?: number
  unit: string
  category: 'user' | 'revenue' | 'performance' | 'engagement'
  trend: 'up' | 'down' | 'stable'
  color: string
  icon: string
}

export interface CustomDashboard {
  id: string
  name: string
  description: string
  widgets: DashboardWidget[]
  layout: 'grid' | 'masonry' | 'custom'
  isDefault: boolean
  createdAt: string
  lastModified: string
}

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'text' | 'image'
  title: string
  data: any
  position: { x: number, y: number, width: number, height: number }
  config: {
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
    timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year'
    refreshInterval?: number
    filters?: any
  }
}

export interface DataExport {
  id: string
  name: string
  type: 'users' | 'revenue' | 'logs' | 'system' | 'custom'
  format: 'csv' | 'excel' | 'json' | 'pdf'
  status: 'completed' | 'processing' | 'failed' | 'queued'
  createdAt: string
  size: number
  recordCount: number
  downloadUrl?: string
  expiresAt: string
}

// Hook pour les rapports automatiques
export function useReports() {
  const [reports, setReports] = useState<AnalyticsReport[]>([
    {
      id: 'daily-1',
      name: 'Rapport Quotidien',
      type: 'daily',
      format: 'pdf',
      status: 'generated',
      createdAt: new Date().toISOString(),
      size: 2.4,
      downloadUrl: '/reports/daily-report.pdf',
      metrics: ['users', 'revenue', 'engagement', 'performance'],
      period: {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    },
    {
      id: 'weekly-1',
      name: 'Rapport Hebdomadaire',
      type: 'weekly',
      format: 'excel',
      status: 'generated',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      size: 5.8,
      downloadUrl: '/reports/weekly-report.xlsx',
      metrics: ['users', 'revenue', 'engagement', 'conversions', 'traffic'],
      period: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    },
    {
      id: 'monthly-1',
      name: 'Rapport Mensuel',
      type: 'monthly',
      format: 'pdf',
      status: 'generating',
      createdAt: new Date().toISOString(),
      size: 0,
      metrics: ['all'],
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    }
  ])

  const generateReport = async (type: 'daily' | 'weekly' | 'monthly', metrics: string[], format: 'pdf' | 'csv' | 'excel') => {
    const reportId = `${type}-${Date.now()}`

    const newReport: AnalyticsReport = {
      id: reportId,
      name: `Rapport ${type === 'daily' ? 'Quotidien' : type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}`,
      type,
      format,
      status: 'generating',
      createdAt: new Date().toISOString(),
      size: 0,
      metrics,
      period: {
        start: new Date(Date.now() - (type === 'daily' ? 1 : type === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    }

    setReports(prev => [newReport, ...prev])

    // Simuler la génération
    setTimeout(() => {
      setReports(prev => prev.map(report =>
        report.id === reportId
          ? {
              ...report,
              status: Math.random() > 0.1 ? 'generated' : 'failed',
              size: Math.random() * 10 + 1,
              downloadUrl: `/reports/${reportId}.${format}`
            }
          : report
      ))
    }, Math.random() * 10000 + 5000) // 5-15 secondes

    return reportId
  }

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId))
  }

  return {
    reports,
    generateReport,
    deleteReport
  }
}

// Hook pour les KPIs personnalisés
export function useKPIs() {
  const [kpis, setKPIs] = useState<KPIMetric[]>([
    {
      id: 'users-active',
      name: 'Utilisateurs Actifs',
      value: 12450,
      previousValue: 11800,
      target: 15000,
      unit: 'users',
      category: 'user',
      trend: 'up',
      color: '#04B4F5',
      icon: 'users'
    },
    {
      id: 'revenue-monthly',
      name: 'Revenus Mensuels',
      value: 89500,
      previousValue: 82300,
      target: 100000,
      unit: '€',
      category: 'revenue',
      trend: 'up',
      color: '#10B981',
      icon: 'trending-up'
    },
    {
      id: 'conversion-rate',
      name: 'Taux de Conversion',
      value: 3.8,
      previousValue: 4.2,
      unit: '%',
      category: 'performance',
      trend: 'down',
      color: '#F59E0B',
      icon: 'target'
    },
    {
      id: 'engagement-time',
      name: 'Temps d\'Engagement',
      value: 4.2,
      previousValue: 3.9,
      target: 5.0,
      unit: 'min',
      category: 'engagement',
      trend: 'up',
      color: '#8B5CF6',
      icon: 'clock'
    },
    {
      id: 'response-time',
      name: 'Temps de Réponse',
      value: 180,
      previousValue: 220,
      target: 150,
      unit: 'ms',
      category: 'performance',
      trend: 'up',
      color: '#06B6D4',
      icon: 'zap'
    },
    {
      id: 'customer-satisfaction',
      name: 'Satisfaction Client',
      value: 4.6,
      previousValue: 4.4,
      target: 4.8,
      unit: '/5',
      category: 'engagement',
      trend: 'up',
      color: '#F472B6',
      icon: 'heart'
    }
  ])

  const updateKPI = (id: string, newValue: number) => {
    setKPIs(prev => prev.map(kpi =>
      kpi.id === id
        ? {
            ...kpi,
            previousValue: kpi.value,
            value: newValue,
            trend: newValue > kpi.value ? 'up' : newValue < kpi.value ? 'down' : 'stable'
          }
        : kpi
    ))
  }

  const addKPI = (kpi: Omit<KPIMetric, 'id'>) => {
    const newKPI: KPIMetric = {
      ...kpi,
      id: `kpi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setKPIs(prev => [...prev, newKPI])
  }

  const removeKPI = (id: string) => {
    setKPIs(prev => prev.filter(kpi => kpi.id !== id))
  }

  return {
    kpis,
    updateKPI,
    addKPI,
    removeKPI
  }
}

// Hook pour les dashboards personnalisés
export function useCustomDashboards() {
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([
    {
      id: 'default',
      name: 'Dashboard Principal',
      description: 'Vue d\'ensemble des métriques principales',
      widgets: [],
      layout: 'grid',
      isDefault: true,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    {
      id: 'sales',
      name: 'Dashboard Ventes',
      description: 'Métriques commerciales et revenus',
      widgets: [],
      layout: 'masonry',
      isDefault: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastModified: new Date().toISOString()
    }
  ])

  const [activeDashboard, setActiveDashboard] = useState('default')

  const createDashboard = (name: string, description: string) => {
    const newDashboard: CustomDashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      widgets: [],
      layout: 'grid',
      isDefault: false,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    setDashboards(prev => [...prev, newDashboard])
    return newDashboard.id
  }

  const updateDashboard = (id: string, updates: Partial<CustomDashboard>) => {
    setDashboards(prev => prev.map(dashboard =>
      dashboard.id === id
        ? { ...dashboard, ...updates, lastModified: new Date().toISOString() }
        : dashboard
    ))
  }

  const deleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(dashboard => dashboard.id !== id && !dashboard.isDefault))
  }

  const addWidget = (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    setDashboards(prev => prev.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            widgets: [...dashboard.widgets, newWidget],
            lastModified: new Date().toISOString()
          }
        : dashboard
    ))
  }

  const removeWidget = (dashboardId: string, widgetId: string) => {
    setDashboards(prev => prev.map(dashboard =>
      dashboard.id === dashboardId
        ? {
            ...dashboard,
            widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
            lastModified: new Date().toISOString()
          }
        : dashboard
    ))
  }

  return {
    dashboards,
    activeDashboard,
    setActiveDashboard,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addWidget,
    removeWidget
  }
}

// Hook pour les exports de données
export function useDataExports() {
  const [exports, setExports] = useState<DataExport[]>([
    {
      id: 'export-1',
      name: 'Utilisateurs - Janvier 2024',
      type: 'users',
      format: 'csv',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      size: 1.2,
      recordCount: 15420,
      downloadUrl: '/exports/users-jan-2024.csv',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'export-2',
      name: 'Revenus - Q4 2023',
      type: 'revenue',
      format: 'excel',
      status: 'completed',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      size: 3.8,
      recordCount: 8934,
      downloadUrl: '/exports/revenue-q4-2023.xlsx',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'export-3',
      name: 'Logs Système - Cette semaine',
      type: 'logs',
      format: 'json',
      status: 'processing',
      createdAt: new Date().toISOString(),
      size: 0,
      recordCount: 0,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  const createExport = async (
    name: string,
    type: DataExport['type'],
    format: DataExport['format'],
    filters?: any
  ) => {
    const exportId = `export-${Date.now()}`

    const newExport: DataExport = {
      id: exportId,
      name,
      type,
      format,
      status: 'processing',
      createdAt: new Date().toISOString(),
      size: 0,
      recordCount: 0,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    setExports(prev => [newExport, ...prev])

    // Simuler le traitement
    setTimeout(() => {
      const success = Math.random() > 0.05 // 95% de succès

      setExports(prev => prev.map(exp =>
        exp.id === exportId
          ? {
              ...exp,
              status: success ? 'completed' : 'failed',
              size: success ? Math.random() * 10 + 0.5 : 0,
              recordCount: success ? Math.floor(Math.random() * 50000 + 1000) : 0,
              downloadUrl: success ? `/exports/${exportId}.${format}` : undefined
            }
          : exp
      ))
    }, Math.random() * 15000 + 5000) // 5-20 secondes

    return exportId
  }

  const deleteExport = (exportId: string) => {
    setExports(prev => prev.filter(exp => exp.id !== exportId))
  }

  return {
    exports,
    createExport,
    deleteExport
  }
}

// Hook pour les intégrations
export function useIntegrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Notifications et rapports automatiques',
      status: 'connected',
      lastSync: new Date(Date.now() - 1800000).toISOString(),
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        channels: ['#general', '#dev-ops', '#analytics']
      }
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Alertes et monitoring',
      status: 'connected',
      lastSync: new Date(Date.now() - 900000).toISOString(),
      config: {
        webhookUrl: 'https://discord.com/api/webhooks/...',
        channels: ['monitoring', 'alerts']
      }
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Données de trafic web',
      status: 'disconnected',
      lastSync: null,
      config: {}
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Données de paiement et revenus',
      status: 'connected',
      lastSync: new Date(Date.now() - 600000).toISOString(),
      config: {
        apiKey: 'sk_live_...',
        webhookEndpoint: '/api/webhooks/stripe'
      }
    }
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id
        ? {
            ...integration,
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: integration.status === 'disconnected' ? new Date().toISOString() : integration.lastSync
          }
        : integration
    ))
  }

  const updateIntegration = (id: string, config: any) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id
        ? {
            ...integration,
            config: { ...integration.config, ...config },
            lastSync: new Date().toISOString()
          }
        : integration
    ))
  }

  return {
    integrations,
    toggleIntegration,
    updateIntegration
  }
}