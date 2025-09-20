'use client'

import { useState, useEffect } from 'react'

// Types pour les notifications
export interface NotificationConfig {
  id: string
  name: string
  type: 'email' | 'webhook' | 'sms'
  enabled: boolean
  config: {
    email?: string
    webhookUrl?: string
    phoneNumber?: string
    discordWebhook?: string
    slackWebhook?: string
  }
  triggers: {
    critical: boolean
    warning: boolean
    info: boolean
  }
}

export interface AlertThreshold {
  metric: string
  operator: '>' | '<' | '=' | '>=' | '<='
  value: number
  severity: 'critical' | 'warning' | 'info'
  enabled: boolean
}

export interface NotificationHistory {
  id: string
  timestamp: string
  type: 'email' | 'webhook' | 'sms'
  recipient: string
  subject: string
  message: string
  status: 'sent' | 'failed' | 'pending'
  alertId: string
}

// Hook pour la gestion des notifications
export function useNotifications() {
  const [configs, setConfigs] = useState<NotificationConfig[]>([
    {
      id: 'email-admin',
      name: 'Email Admin',
      type: 'email',
      enabled: true,
      config: {
        email: 'admin@votredomaine.com'
      },
      triggers: {
        critical: true,
        warning: true,
        info: false
      }
    },
    {
      id: 'discord-devops',
      name: 'Discord DevOps',
      type: 'webhook',
      enabled: true,
      config: {
        discordWebhook: 'https://discord.com/api/webhooks/...'
      },
      triggers: {
        critical: true,
        warning: false,
        info: false
      }
    },
    {
      id: 'slack-alerts',
      name: 'Slack Alerts',
      type: 'webhook',
      enabled: false,
      config: {
        slackWebhook: 'https://hooks.slack.com/services/...'
      },
      triggers: {
        critical: true,
        warning: true,
        info: false
      }
    }
  ])

  const [history, setHistory] = useState<NotificationHistory[]>([])

  // Simuler l'envoi de notifications
  const sendNotification = async (config: NotificationConfig, alertType: string, message: string, alertId: string) => {
    const notification: NotificationHistory = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: config.type,
      recipient: config.config.email || config.config.webhookUrl || config.name,
      subject: `[${alertType.toUpperCase()}] Alerte Système`,
      message,
      status: 'pending',
      alertId
    }

    setHistory(prev => [notification, ...prev.slice(0, 49)]) // Garde 50 notifications max

    // Simuler l'envoi
    setTimeout(() => {
      setHistory(prev => prev.map(n =>
        n.id === notification.id
          ? { ...n, status: Math.random() > 0.1 ? 'sent' : 'failed' }
          : n
      ))
    }, Math.random() * 3000 + 1000) // 1-4 secondes
  }

  const updateConfig = (id: string, updates: Partial<NotificationConfig>) => {
    setConfigs(prev => prev.map(config =>
      config.id === id ? { ...config, ...updates } : config
    ))
  }

  const addConfig = (config: Omit<NotificationConfig, 'id'>) => {
    const newConfig: NotificationConfig = {
      ...config,
      id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setConfigs(prev => [...prev, newConfig])
  }

  const removeConfig = (id: string) => {
    setConfigs(prev => prev.filter(config => config.id !== id))
  }

  return {
    configs,
    history,
    sendNotification,
    updateConfig,
    addConfig,
    removeConfig
  }
}

// Hook pour les seuils d'alerte
export function useAlertThresholds() {
  const [thresholds, setThresholds] = useState<AlertThreshold[]>([
    {
      metric: 'cpu',
      operator: '>',
      value: 80,
      severity: 'warning',
      enabled: true
    },
    {
      metric: 'cpu',
      operator: '>',
      value: 95,
      severity: 'critical',
      enabled: true
    },
    {
      metric: 'memory_percent',
      operator: '>',
      value: 85,
      severity: 'warning',
      enabled: true
    },
    {
      metric: 'memory_percent',
      operator: '>',
      value: 95,
      severity: 'critical',
      enabled: true
    },
    {
      metric: 'disk_percent',
      operator: '>',
      value: 90,
      severity: 'warning',
      enabled: true
    },
    {
      metric: 'disk_percent',
      operator: '>',
      value: 98,
      severity: 'critical',
      enabled: true
    },
    {
      metric: 'response_time',
      operator: '>',
      value: 1000,
      severity: 'warning',
      enabled: true
    },
    {
      metric: 'error_rate',
      operator: '>',
      value: 5,
      severity: 'critical',
      enabled: true
    }
  ])

  const updateThreshold = (index: number, updates: Partial<AlertThreshold>) => {
    setThresholds(prev => prev.map((threshold, i) =>
      i === index ? { ...threshold, ...updates } : threshold
    ))
  }

  const addThreshold = (threshold: AlertThreshold) => {
    setThresholds(prev => [...prev, threshold])
  }

  const removeThreshold = (index: number) => {
    setThresholds(prev => prev.filter((_, i) => i !== index))
  }

  // Vérifier les seuils avec les métriques actuelles
  const checkThresholds = (systemData: any, performanceData: any) => {
    const violations: Array<{threshold: AlertThreshold, currentValue: number}> = []

    thresholds.forEach(threshold => {
      if (!threshold.enabled) return

      let currentValue = 0

      switch (threshold.metric) {
        case 'cpu':
          currentValue = systemData.cpu
          break
        case 'memory_percent':
          currentValue = (systemData.memory.used / systemData.memory.total) * 100
          break
        case 'disk_percent':
          currentValue = (systemData.disk.used / systemData.disk.total) * 100
          break
        case 'response_time':
          currentValue = performanceData.responseTime
          break
        case 'error_rate':
          currentValue = performanceData.errorRate
          break
      }

      const isViolated = (() => {
        switch (threshold.operator) {
          case '>': return currentValue > threshold.value
          case '<': return currentValue < threshold.value
          case '>=': return currentValue >= threshold.value
          case '<=': return currentValue <= threshold.value
          case '=': return currentValue === threshold.value
          default: return false
        }
      })()

      if (isViolated) {
        violations.push({ threshold, currentValue })
      }
    })

    return violations
  }

  return {
    thresholds,
    updateThreshold,
    addThreshold,
    removeThreshold,
    checkThresholds
  }
}

// Hook pour les notifications push dans le navigateur
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('Notification' in window)
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }

  const sendPushNotification = (title: string, options: NotificationOptions = {}) => {
    if (permission !== 'granted') return

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })

    // Auto-fermer après 5 secondes
    setTimeout(() => notification.close(), 5000)

    return notification
  }

  return {
    isSupported,
    permission,
    requestPermission,
    sendPushNotification
  }
}