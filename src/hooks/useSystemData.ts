'use client'

import { useState, useEffect } from 'react'
import { systemService, strapiService } from '@/lib/api'

// Types pour les données système
export interface SystemMetrics {
  cpu: number
  memory: { used: number, total: number }
  disk: { used: number, total: number }
  network: { download: number, upload: number }
  uptime: number
  processes: ProcessInfo[]
  services: ServiceInfo[]
}

export interface ProcessInfo {
  pid: number
  name: string
  cpu: number
  memory: number
  status: 'running' | 'sleeping' | 'stopped'
}

export interface ServiceInfo {
  name: string
  status: 'online' | 'stopped' | 'errored' | 'unknown'
  uptime: number
  restarts: number
  port?: number
  memory?: number
}

export interface LogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  service: string
  message: string
  source?: string
}

export interface AlertInfo {
  id: string
  type: 'critical' | 'warning' | 'info'
  service: string
  message: string
  timestamp: string
  resolved: boolean
}

export interface BusinessMetrics {
  // Métriques Hero Section
  bobiesGeneres: number
  clientsActifs: number
  invitationsEnCours: number

  // Métriques détaillées
  users: { active: number, total: number, growth: number }
  requests: { prets: number, emprunts: number, services: number, evenements: number, total: number, recentGrowth: number }
  engagement: { rate: number, sessions: number, duration: number }
  conversions: { count: number, rate: number, growth: number }
}

// Hook pour les métriques système (DevOps)
export function useSystemMetrics() {
  const [data, setData] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSystemMetrics() {
      try {
        setLoading(true)
        // Utiliser le vrai service API système
        const systemData = await systemService.getSystemMetrics()
        setData(systemData)
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Erreur lors du chargement des métriques système:', err)
        setError('Erreur lors du chargement des métriques système')
        setLoading(false)
      }
    }

    fetchSystemMetrics()

    // Mise à jour toutes les 5 secondes
    const interval = setInterval(fetchSystemMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}

// Hook pour les métriques business (Data)
export function useBusinessMetrics() {
  const [data, setData] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBusinessMetrics() {
      try {
        setLoading(true)
        // Utiliser le vrai service Strapi
        const businessData = await strapiService.getBusinessMetrics()
        setData(businessData)
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Erreur lors du chargement des métriques business:', err)
        setError('Erreur lors du chargement des métriques business')
        setLoading(false)
      }
    }

    fetchBusinessMetrics()

    // Mise à jour toutes les 30 secondes
    const interval = setInterval(fetchBusinessMetrics, 30000)

    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}

// Hook pour récupérer la liste des utilisateurs
export function useUsers(page = 1, pageSize = 25, filters = {}) {
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const userData = await strapiService.getUsersPaginated(page, pageSize, filters)
        setUsers(userData.data || userData) // Adapter selon la structure de réponse Strapi
        setPagination(userData.meta?.pagination || null)
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err)
        setError('Erreur lors du chargement des utilisateurs')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, pageSize, JSON.stringify(filters)])

  return { users, pagination, loading, error }
}

// Hook pour les logs en temps réel
export function useLiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // Récupérer les logs réels du système
    async function fetchLogs() {
      try {
        const systemLogs = await systemService.getSystemLogs()
        setLogs(systemLogs)
      } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error)
      }
    }

    fetchLogs()

    // Mettre à jour les logs toutes les 5 secondes
    const interval = setInterval(fetchLogs, 5000)

    return () => clearInterval(interval)
  }, [])

  return logs
}

// Hook pour les alertes système
export function useSystemAlerts() {
  const [alerts, setAlerts] = useState<AlertInfo[]>([])

  useEffect(() => {
    // Récupérer les alertes réelles du système
    async function fetchAlerts() {
      try {
        const systemAlerts = await systemService.getSystemAlerts()
        setAlerts(systemAlerts)
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error)
      }
    }

    fetchAlerts()

    // Mettre à jour les alertes toutes les 10 secondes
    const interval = setInterval(fetchAlerts, 10000)

    return () => clearInterval(interval)
  }, [])

  return alerts
}

// Hook pour les métriques de performance
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    requestsPerSecond: 0,
    errorRate: 0,
    throughput: 0
  })

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
        requestsPerSecond: Math.floor(Math.random() * 100) + 50, // 50-150 req/s
        errorRate: Math.random() * 5, // 0-5%
        throughput: Math.floor(Math.random() * 1000) + 500 // 500-1500 MB/h
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 3000) // Mise à jour toutes les 3 secondes

    return () => clearInterval(interval)
  }, [])

  return metrics
}

// Utilitaires pour formater les données
export const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600))
  const hours = Math.floor((seconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) return `${days}j ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num)
}