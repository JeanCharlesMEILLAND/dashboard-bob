'use client'

import { useState, useEffect } from 'react'

// Types pour la sécurité et maintenance
export interface SecurityAlert {
  id: string
  type: 'intrusion' | 'suspicious_activity' | 'blocked_ip' | 'failed_login' | 'malware' | 'vulnerability'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  description: string
  timestamp: string
  resolved: boolean
  details: {
    ip?: string
    country?: string
    attempts?: number
    protocol?: string
    port?: number
    userAgent?: string
  }
}

export interface FirewallRule {
  id: string
  name: string
  action: 'allow' | 'block' | 'log'
  protocol: 'tcp' | 'udp' | 'icmp' | 'all'
  sourceIp: string
  destinationPort: string
  enabled: boolean
  priority: number
  description: string
  createdAt: string
  hitCount: number
}

export interface Fail2BanJail {
  name: string
  enabled: boolean
  filter: string
  logPath: string
  maxRetry: number
  findTime: number
  banTime: number
  bannedIps: string[]
  failureCount: number
  currentlyBanned: number
}

export interface SystemUpdate {
  id: string
  package: string
  currentVersion: string
  availableVersion: string
  type: 'security' | 'enhancement' | 'bugfix'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  size: number
  releaseDate: string
  installStatus: 'pending' | 'installing' | 'installed' | 'failed'
}

export interface SecurityScan {
  id: string
  type: 'vulnerability' | 'malware' | 'integrity' | 'ports' | 'network'
  status: 'running' | 'completed' | 'failed' | 'scheduled'
  progress: number
  startTime: string
  endTime?: string
  results: {
    total: number
    critical: number
    high: number
    medium: number
    low: number
    clean: number
  }
  findings: SecurityFinding[]
}

export interface SecurityFinding {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  description: string
  recommendation: string
  file?: string
  line?: number
  cve?: string
}

// Hook pour les alertes de sécurité
export function useSecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'alert-1',
      type: 'intrusion',
      severity: 'critical',
      source: 'fail2ban',
      description: 'Tentative de force brute SSH détectée depuis 185.220.101.42',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false,
      details: {
        ip: '185.220.101.42',
        country: 'Russia',
        attempts: 127,
        protocol: 'SSH',
        port: 22
      }
    },
    {
      id: 'alert-2',
      type: 'blocked_ip',
      severity: 'high',
      source: 'firewall',
      description: 'IP bloquée pour activité suspecte',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      resolved: true,
      details: {
        ip: '192.168.1.100',
        attempts: 45,
        protocol: 'HTTP',
        port: 80
      }
    },
    {
      id: 'alert-3',
      type: 'failed_login',
      severity: 'medium',
      source: 'auth',
      description: 'Échecs de connexion répétés pour admin@example.com',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      resolved: false,
      details: {
        attempts: 8,
        userAgent: 'Mozilla/5.0 (compatible; Bot/1.0)'
      }
    },
    {
      id: 'alert-4',
      type: 'vulnerability',
      severity: 'high',
      source: 'scanner',
      description: 'Vulnérabilité critique détectée dans OpenSSL',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
      details: {}
    }
  ])

  const markResolved = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
  }

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const addAlert = (alert: Omit<SecurityAlert, 'id'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setAlerts(prev => [newAlert, ...prev])
  }

  return {
    alerts,
    unresolvedAlerts: alerts.filter(alert => !alert.resolved),
    markResolved,
    deleteAlert,
    addAlert
  }
}

// Hook pour la gestion du firewall
export function useFirewall() {
  const [rules, setRules] = useState<FirewallRule[]>([
    {
      id: 'rule-1',
      name: 'Block SSH Brute Force',
      action: 'block',
      protocol: 'tcp',
      sourceIp: '0.0.0.0/0',
      destinationPort: '22',
      enabled: true,
      priority: 1,
      description: 'Bloquer les tentatives de force brute SSH',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      hitCount: 1247
    },
    {
      id: 'rule-2',
      name: 'Allow HTTP/HTTPS',
      action: 'allow',
      protocol: 'tcp',
      sourceIp: '0.0.0.0/0',
      destinationPort: '80,443',
      enabled: true,
      priority: 2,
      description: 'Autoriser le trafic web standard',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      hitCount: 89234
    },
    {
      id: 'rule-3',
      name: 'Block Tor Network',
      action: 'block',
      protocol: 'all',
      sourceIp: '192.42.116.0/24',
      destinationPort: '*',
      enabled: true,
      priority: 3,
      description: 'Bloquer le trafic depuis les nœuds Tor connus',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      hitCount: 456
    },
    {
      id: 'rule-4',
      name: 'Log Database Access',
      action: 'log',
      protocol: 'tcp',
      sourceIp: '10.0.0.0/8',
      destinationPort: '3306,5432',
      enabled: true,
      priority: 4,
      description: 'Logger tous les accès aux bases de données',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      hitCount: 2341
    }
  ])

  const addRule = (rule: Omit<FirewallRule, 'id' | 'createdAt' | 'hitCount'>) => {
    const newRule: FirewallRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      hitCount: 0
    }
    setRules(prev => [...prev, newRule])
  }

  const updateRule = (id: string, updates: Partial<FirewallRule>) => {
    setRules(prev => prev.map(rule =>
      rule.id === id ? { ...rule, ...updates } : rule
    ))
  }

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id))
  }

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  return {
    rules,
    activeRules: rules.filter(rule => rule.enabled),
    addRule,
    updateRule,
    deleteRule,
    toggleRule
  }
}

// Hook pour Fail2Ban
export function useFail2Ban() {
  const [jails, setJails] = useState<Fail2BanJail[]>([
    {
      name: 'sshd',
      enabled: true,
      filter: 'sshd',
      logPath: '/var/log/auth.log',
      maxRetry: 3,
      findTime: 600,
      banTime: 3600,
      bannedIps: ['185.220.101.42', '192.168.1.100', '203.0.113.42'],
      failureCount: 127,
      currentlyBanned: 3
    },
    {
      name: 'apache-auth',
      enabled: true,
      filter: 'apache-auth',
      logPath: '/var/log/apache2/error.log',
      maxRetry: 5,
      findTime: 600,
      banTime: 1800,
      bannedIps: ['198.51.100.23'],
      failureCount: 45,
      currentlyBanned: 1
    },
    {
      name: 'nginx-http-auth',
      enabled: false,
      filter: 'nginx-http-auth',
      logPath: '/var/log/nginx/error.log',
      maxRetry: 5,
      findTime: 600,
      banTime: 1800,
      bannedIps: [],
      failureCount: 0,
      currentlyBanned: 0
    },
    {
      name: 'postfix-sasl',
      enabled: true,
      filter: 'postfix-sasl',
      logPath: '/var/log/mail.log',
      maxRetry: 3,
      findTime: 600,
      banTime: 7200,
      bannedIps: ['203.0.113.15', '198.51.100.45'],
      failureCount: 23,
      currentlyBanned: 2
    }
  ])

  const updateJail = (name: string, updates: Partial<Fail2BanJail>) => {
    setJails(prev => prev.map(jail =>
      jail.name === name ? { ...jail, ...updates } : jail
    ))
  }

  const toggleJail = (name: string) => {
    setJails(prev => prev.map(jail =>
      jail.name === name ? { ...jail, enabled: !jail.enabled } : jail
    ))
  }

  const unbanIp = (jailName: string, ip: string) => {
    setJails(prev => prev.map(jail =>
      jail.name === jailName
        ? {
            ...jail,
            bannedIps: jail.bannedIps.filter(bannedIp => bannedIp !== ip),
            currentlyBanned: jail.currentlyBanned - 1
          }
        : jail
    ))
  }

  const banIp = (jailName: string, ip: string, reason: string) => {
    setJails(prev => prev.map(jail =>
      jail.name === jailName
        ? {
            ...jail,
            bannedIps: [...jail.bannedIps, ip],
            currentlyBanned: jail.currentlyBanned + 1
          }
        : jail
    ))
  }

  return {
    jails,
    activeJails: jails.filter(jail => jail.enabled),
    totalBannedIps: jails.reduce((sum, jail) => sum + jail.currentlyBanned, 0),
    updateJail,
    toggleJail,
    unbanIp,
    banIp
  }
}

// Hook pour les mises à jour système
export function useSystemUpdates() {
  const [updates, setUpdates] = useState<SystemUpdate[]>([
    {
      id: 'update-1',
      package: 'openssl',
      currentVersion: '1.1.1f',
      availableVersion: '1.1.1w',
      type: 'security',
      severity: 'critical',
      description: 'Correctif de sécurité critique pour OpenSSL - CVE-2023-0286',
      size: 2.4,
      releaseDate: new Date(Date.now() - 172800000).toISOString(),
      installStatus: 'pending'
    },
    {
      id: 'update-2',
      package: 'nginx',
      currentVersion: '1.18.0',
      availableVersion: '1.20.2',
      type: 'security',
      severity: 'high',
      description: 'Mise à jour de sécurité pour Nginx',
      size: 1.8,
      releaseDate: new Date(Date.now() - 259200000).toISOString(),
      installStatus: 'pending'
    },
    {
      id: 'update-3',
      package: 'kernel',
      currentVersion: '5.4.0-74',
      availableVersion: '5.4.0-91',
      type: 'security',
      severity: 'high',
      description: 'Mise à jour du noyau Linux avec correctifs de sécurité',
      size: 45.2,
      releaseDate: new Date(Date.now() - 345600000).toISOString(),
      installStatus: 'pending'
    },
    {
      id: 'update-4',
      package: 'apache2',
      currentVersion: '2.4.41',
      availableVersion: '2.4.54',
      type: 'enhancement',
      severity: 'medium',
      description: 'Amélioration des performances et corrections de bugs',
      size: 3.1,
      releaseDate: new Date(Date.now() - 432000000).toISOString(),
      installStatus: 'installed'
    }
  ])

  const installUpdate = async (updateId: string) => {
    setUpdates(prev => prev.map(update =>
      update.id === updateId
        ? { ...update, installStatus: 'installing' }
        : update
    ))

    // Simuler l'installation
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% de succès

      setUpdates(prev => prev.map(update =>
        update.id === updateId
          ? { ...update, installStatus: success ? 'installed' : 'failed' }
          : update
      ))
    }, Math.random() * 10000 + 5000) // 5-15 secondes
  }

  const checkForUpdates = async () => {
    // Simuler la vérification des mises à jour
    setTimeout(() => {
      const newUpdate: SystemUpdate = {
        id: `update-${Date.now()}`,
        package: 'curl',
        currentVersion: '7.68.0',
        availableVersion: '7.88.1',
        type: 'security',
        severity: 'medium',
        description: 'Correctif de sécurité pour cURL',
        size: 0.8,
        releaseDate: new Date().toISOString(),
        installStatus: 'pending'
      }

      setUpdates(prev => [newUpdate, ...prev])
    }, 2000)
  }

  return {
    updates,
    pendingUpdates: updates.filter(update => update.installStatus === 'pending'),
    securityUpdates: updates.filter(update => update.type === 'security' && update.installStatus === 'pending'),
    installUpdate,
    checkForUpdates
  }
}

// Hook pour les scans de sécurité
export function useSecurityScans() {
  const [scans, setScans] = useState<SecurityScan[]>([
    {
      id: 'scan-1',
      type: 'vulnerability',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() - 3300000).toISOString(),
      results: {
        total: 45,
        critical: 2,
        high: 5,
        medium: 12,
        low: 26,
        clean: 0
      },
      findings: [
        {
          id: 'finding-1',
          severity: 'critical',
          type: 'CVE-2023-0286',
          description: 'Vulnérabilité critique dans OpenSSL',
          recommendation: 'Mettre à jour vers OpenSSL 1.1.1w immédiatement',
          cve: 'CVE-2023-0286'
        },
        {
          id: 'finding-2',
          severity: 'high',
          type: 'Weak SSH Configuration',
          description: 'Configuration SSH faible détectée',
          recommendation: 'Désactiver l\'authentification par mot de passe et utiliser uniquement les clés',
          file: '/etc/ssh/sshd_config',
          line: 45
        }
      ]
    },
    {
      id: 'scan-2',
      type: 'malware',
      status: 'running',
      progress: 67,
      startTime: new Date(Date.now() - 1800000).toISOString(),
      results: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        clean: 245687
      },
      findings: []
    },
    {
      id: 'scan-3',
      type: 'ports',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 7020000).toISOString(),
      results: {
        total: 12,
        critical: 0,
        high: 1,
        medium: 3,
        low: 8,
        clean: 0
      },
      findings: [
        {
          id: 'finding-3',
          severity: 'high',
          type: 'Open Port',
          description: 'Port 3306 (MySQL) ouvert publiquement',
          recommendation: 'Limiter l\'accès MySQL aux IPs de confiance uniquement'
        }
      ]
    }
  ])

  const startScan = async (type: SecurityScan['type']) => {
    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newScan: SecurityScan = {
      id: scanId,
      type,
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      results: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        clean: 0
      },
      findings: []
    }

    setScans(prev => [newScan, ...prev])

    // Simuler le scan
    const interval = setInterval(() => {
      setScans(prev => prev.map(scan =>
        scan.id === scanId
          ? { ...scan, progress: Math.min(scan.progress + Math.random() * 15, 100) }
          : scan
      ))
    }, 1000)

    setTimeout(() => {
      clearInterval(interval)

      // Résultats simulés
      const mockResults = {
        total: Math.floor(Math.random() * 50 + 10),
        critical: Math.floor(Math.random() * 3),
        high: Math.floor(Math.random() * 8),
        medium: Math.floor(Math.random() * 15),
        low: Math.floor(Math.random() * 25),
        clean: Math.floor(Math.random() * 1000)
      }

      setScans(prev => prev.map(scan =>
        scan.id === scanId
          ? {
              ...scan,
              status: 'completed',
              progress: 100,
              endTime: new Date().toISOString(),
              results: mockResults
            }
          : scan
      ))
    }, Math.random() * 30000 + 10000) // 10-40 secondes

    return scanId
  }

  const deleteScan = (scanId: string) => {
    setScans(prev => prev.filter(scan => scan.id !== scanId))
  }

  return {
    scans,
    runningScan: scans.find(scan => scan.status === 'running'),
    recentScans: scans.filter(scan => scan.status === 'completed').slice(0, 5),
    startScan,
    deleteScan
  }
}

// Hook pour les métriques de sécurité globales
export function useSecurityMetrics() {
  const { unresolvedAlerts } = useSecurityAlerts()
  const { activeRules } = useFirewall()
  const { totalBannedIps, activeJails } = useFail2Ban()
  const { securityUpdates } = useSystemUpdates()

  const getSecurityScore = () => {
    let score = 100

    // Déductions basées sur les alertes non résolues
    score -= unresolvedAlerts.length * 5
    score -= unresolvedAlerts.filter(a => a.severity === 'critical').length * 15
    score -= unresolvedAlerts.filter(a => a.severity === 'high').length * 10

    // Déductions pour les mises à jour de sécurité en attente
    score -= securityUpdates.length * 8
    score -= securityUpdates.filter(u => u.severity === 'critical').length * 20

    // Bonus pour les mesures de sécurité actives
    score += Math.min(activeRules.length * 2, 20)
    score += Math.min(activeJails.length * 5, 15)

    return Math.max(score, 0)
  }

  const getSecurityLevel = () => {
    const score = getSecurityScore()
    if (score >= 90) return { level: 'excellent', color: 'green' }
    if (score >= 75) return { level: 'good', color: 'blue' }
    if (score >= 60) return { level: 'moderate', color: 'yellow' }
    if (score >= 40) return { level: 'poor', color: 'orange' }
    return { level: 'critical', color: 'red' }
  }

  return {
    securityScore: getSecurityScore(),
    securityLevel: getSecurityLevel(),
    totalThreats: unresolvedAlerts.length,
    blockedIps: totalBannedIps,
    activeProtections: activeRules.length + activeJails.length,
    pendingUpdates: securityUpdates.length
  }
}