'use client'

import { useState, useEffect } from 'react'

// Types pour la gestion d'infrastructure
export interface PM2Process {
  id: number
  name: string
  status: 'online' | 'stopped' | 'errored' | 'unknown'
  uptime: number
  restarts: number
  memory: number
  cpu: number
  instances: number
  pid?: number
  port?: number
  env: string
  mode: 'fork' | 'cluster'
}

export interface RedisInfo {
  connected: boolean
  version: string
  uptime: number
  memory: {
    used: number
    peak: number
    fragmentation: number
  }
  stats: {
    totalConnections: number
    totalCommands: number
    keyspace: {
      db0?: number
      db1?: number
    }
    hitRate: number
  }
  config: {
    maxMemory: string
    timeout: number
    databases: number
  }
}

export interface BackupInfo {
  id: string
  name: string
  type: 'database' | 'files' | 'full'
  size: number
  status: 'completed' | 'running' | 'failed' | 'scheduled'
  createdAt: string
  duration?: number
  location: string
  description?: string
}

export interface InfrastructureCommand {
  id: string
  command: string
  status: 'running' | 'completed' | 'failed'
  output: string[]
  startTime: string
  endTime?: string
  user: string
}

// Hook pour la gestion PM2
export function usePM2Control() {
  const [processes, setProcesses] = useState<PM2Process[]>([
    {
      id: 0,
      name: 'strapi-api',
      status: 'online',
      uptime: 3600000,
      restarts: 2,
      memory: 245,
      cpu: 8.5,
      instances: 1,
      pid: 12345,
      port: 1337,
      env: 'production',
      mode: 'fork'
    },
    {
      id: 1,
      name: 'worker-queue',
      status: 'online',
      uptime: 7200000,
      restarts: 0,
      memory: 128,
      cpu: 3.2,
      instances: 2,
      env: 'production',
      mode: 'cluster'
    },
    {
      id: 2,
      name: 'cron-jobs',
      status: 'stopped',
      uptime: 0,
      restarts: 5,
      memory: 0,
      cpu: 0,
      instances: 1,
      env: 'production',
      mode: 'fork'
    }
  ])

  const [commands, setCommands] = useState<InfrastructureCommand[]>([])

  // Simuler une commande PM2
  const executeCommand = async (command: string, processName?: string) => {
    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCommand: InfrastructureCommand = {
      id: commandId,
      command: `pm2 ${command} ${processName || ''}`.trim(),
      status: 'running',
      output: [`[${new Date().toLocaleTimeString()}] Exécution de: pm2 ${command}...`],
      startTime: new Date().toISOString(),
      user: 'admin'
    }

    setCommands(prev => [newCommand, ...prev.slice(0, 19)]) // Garde 20 commandes max

    // Simuler l'exécution
    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% de succès

      setCommands(prev => prev.map(cmd =>
        cmd.id === commandId
          ? {
              ...cmd,
              status: success ? 'completed' : 'failed',
              output: [
                ...cmd.output,
                success
                  ? `[${new Date().toLocaleTimeString()}] ✅ Commande exécutée avec succès`
                  : `[${new Date().toLocaleTimeString()}] ❌ Erreur lors de l'exécution`,
                `[${new Date().toLocaleTimeString()}] Durée: ${Math.floor(Math.random() * 3000 + 500)}ms`
              ],
              endTime: new Date().toISOString()
            }
          : cmd
      ))

      // Mettre à jour l'état des processus selon la commande
      if (success && processName) {
        updateProcessStatus(processName, command)
      }
    }, Math.random() * 3000 + 1000) // 1-4 secondes

    return commandId
  }

  const updateProcessStatus = (processName: string, command: string) => {
    setProcesses(prev => prev.map(proc => {
      if (proc.name === processName) {
        switch (command) {
          case 'start':
            return { ...proc, status: 'online' as const, uptime: 0, restarts: proc.restarts + 1 }
          case 'stop':
            return { ...proc, status: 'stopped' as const, uptime: 0, cpu: 0, memory: 0 }
          case 'restart':
            return { ...proc, status: 'online' as const, uptime: 0, restarts: proc.restarts + 1 }
          case 'reload':
            return { ...proc, restarts: proc.restarts + 1 }
          default:
            return proc
        }
      }
      return proc
    }))
  }

  // Actions PM2
  const startProcess = (processName: string) => executeCommand('start', processName)
  const stopProcess = (processName: string) => executeCommand('stop', processName)
  const restartProcess = (processName: string) => executeCommand('restart', processName)
  const reloadProcess = (processName: string) => executeCommand('reload', processName)
  const deleteProcess = (processName: string) => executeCommand('delete', processName)
  const scaleProcess = (processName: string, instances: number) =>
    executeCommand(`scale ${processName} ${instances}`)

  return {
    processes,
    commands,
    startProcess,
    stopProcess,
    restartProcess,
    reloadProcess,
    deleteProcess,
    scaleProcess,
    executeCommand
  }
}

// Hook pour la gestion Redis
export function useRedisControl() {
  const [redisInfo, setRedisInfo] = useState<RedisInfo>({
    connected: true,
    version: '7.0.5',
    uptime: 86400000,
    memory: {
      used: 128,
      peak: 256,
      fragmentation: 1.2
    },
    stats: {
      totalConnections: 1250,
      totalCommands: 45000,
      keyspace: {
        db0: 1234,
        db1: 567
      },
      hitRate: 94.5
    },
    config: {
      maxMemory: '256mb',
      timeout: 0,
      databases: 16
    }
  })

  const [commands, setCommands] = useState<InfrastructureCommand[]>([])

  const executeRedisCommand = async (command: string) => {
    const commandId = `redis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newCommand: InfrastructureCommand = {
      id: commandId,
      command: `redis-cli ${command}`,
      status: 'running',
      output: [`[${new Date().toLocaleTimeString()}] Exécution: redis-cli ${command}...`],
      startTime: new Date().toISOString(),
      user: 'admin'
    }

    setCommands(prev => [newCommand, ...prev.slice(0, 19)])

    setTimeout(() => {
      const success = Math.random() > 0.05 // 95% de succès

      let outputMessages = [
        `[${new Date().toLocaleTimeString()}] Connexion à Redis...`,
        `[${new Date().toLocaleTimeString()}] Authentification réussie`
      ]

      if (command.includes('FLUSHDB')) {
        outputMessages.push(`[${new Date().toLocaleTimeString()}] Base de données vidée`)
        // Mettre à jour les stats
        setRedisInfo(prev => ({
          ...prev,
          stats: { ...prev.stats, keyspace: { db0: 0 } }
        }))
      } else if (command.includes('INFO')) {
        outputMessages.push(`[${new Date().toLocaleTimeString()}] Informations récupérées`)
      } else if (command.includes('KEYS')) {
        outputMessages.push(`[${new Date().toLocaleTimeString()}] ${Math.floor(Math.random() * 1000 + 100)} clés trouvées`)
      }

      outputMessages.push(
        success
          ? `[${new Date().toLocaleTimeString()}] ✅ Commande exécutée avec succès`
          : `[${new Date().toLocaleTimeString()}] ❌ Erreur lors de l'exécution`
      )

      setCommands(prev => prev.map(cmd =>
        cmd.id === commandId
          ? {
              ...cmd,
              status: success ? 'completed' : 'failed',
              output: outputMessages,
              endTime: new Date().toISOString()
            }
          : cmd
      ))
    }, Math.random() * 2000 + 500)

    return commandId
  }

  // Actions Redis
  const flushDB = (database = 0) => executeRedisCommand(`-n ${database} FLUSHDB`)
  const flushAll = () => executeRedisCommand('FLUSHALL')
  const getInfo = () => executeRedisCommand('INFO')
  const getKeys = (pattern = '*') => executeRedisCommand(`KEYS ${pattern}`)
  const getMemoryUsage = () => executeRedisCommand('INFO memory')

  return {
    redisInfo,
    commands,
    flushDB,
    flushAll,
    getInfo,
    getKeys,
    getMemoryUsage,
    executeRedisCommand
  }
}

// Hook pour la gestion des sauvegardes
export function useBackupControl() {
  const [backups, setBackups] = useState<BackupInfo[]>([
    {
      id: 'backup-1',
      name: 'daily-database-backup',
      type: 'database',
      size: 2.4, // GB
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      duration: 45000, // ms
      location: '/var/backups/database/2024-01-15.sql.gz',
      description: 'Sauvegarde quotidienne automatique de PostgreSQL'
    },
    {
      id: 'backup-2',
      name: 'weekly-full-backup',
      type: 'full',
      size: 12.8,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      duration: 180000,
      location: '/var/backups/full/2024-01-14.tar.gz',
      description: 'Sauvegarde complète hebdomadaire'
    },
    {
      id: 'backup-3',
      name: 'files-backup',
      type: 'files',
      size: 5.2,
      status: 'running',
      createdAt: new Date().toISOString(),
      location: '/var/backups/files/2024-01-15.tar.gz',
      description: 'Sauvegarde des fichiers utilisateur'
    }
  ])

  const [commands, setCommands] = useState<InfrastructureCommand[]>([])

  const createBackup = async (type: 'database' | 'files' | 'full', name?: string) => {
    const backupId = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const backupName = name || `${type}-backup-${new Date().toISOString().split('T')[0]}`

    const newBackup: BackupInfo = {
      id: backupId,
      name: backupName,
      type,
      size: 0,
      status: 'running',
      createdAt: new Date().toISOString(),
      location: `/var/backups/${type}/${backupName}.${type === 'database' ? 'sql.gz' : 'tar.gz'}`,
      description: `Sauvegarde ${type} créée manuellement`
    }

    setBackups(prev => [newBackup, ...prev])

    // Ajouter la commande
    const commandId = `backup-cmd-${Date.now()}`
    const newCommand: InfrastructureCommand = {
      id: commandId,
      command: `backup-${type} --name ${backupName}`,
      status: 'running',
      output: [
        `[${new Date().toLocaleTimeString()}] Début de la sauvegarde ${type}...`,
        `[${new Date().toLocaleTimeString()}] Nom: ${backupName}`,
        `[${new Date().toLocaleTimeString()}] Destination: ${newBackup.location}`
      ],
      startTime: new Date().toISOString(),
      user: 'admin'
    }

    setCommands(prev => [newCommand, ...prev.slice(0, 19)])

    // Simuler le processus de sauvegarde
    const duration = Math.random() * 60000 + 30000 // 30-90 secondes

    setTimeout(() => {
      const success = Math.random() > 0.1 // 90% de succès
      const finalSize = Math.random() * 10 + 1 // 1-11 GB

      setBackups(prev => prev.map(backup =>
        backup.id === backupId
          ? {
              ...backup,
              status: success ? 'completed' : 'failed',
              size: success ? finalSize : 0,
              duration
            }
          : backup
      ))

      setCommands(prev => prev.map(cmd =>
        cmd.id === commandId
          ? {
              ...cmd,
              status: success ? 'completed' : 'failed',
              output: [
                ...cmd.output,
                `[${new Date().toLocaleTimeString()}] Compression en cours...`,
                success
                  ? `[${new Date().toLocaleTimeString()}] ✅ Sauvegarde terminée (${finalSize.toFixed(1)} GB)`
                  : `[${new Date().toLocaleTimeString()}] ❌ Échec de la sauvegarde`,
                `[${new Date().toLocaleTimeString()}] Durée: ${Math.floor(duration / 1000)}s`
              ],
              endTime: new Date().toISOString()
            }
          : cmd
      ))
    }, duration)

    return backupId
  }

  const deleteBackup = async (backupId: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== backupId))

    const commandId = `delete-backup-${Date.now()}`
    const newCommand: InfrastructureCommand = {
      id: commandId,
      command: `rm backup ${backupId}`,
      status: 'running',
      output: [`[${new Date().toLocaleTimeString()}] Suppression de la sauvegarde...`],
      startTime: new Date().toISOString(),
      user: 'admin'
    }

    setCommands(prev => [newCommand, ...prev.slice(0, 19)])

    setTimeout(() => {
      setCommands(prev => prev.map(cmd =>
        cmd.id === commandId
          ? {
              ...cmd,
              status: 'completed',
              output: [
                ...cmd.output,
                `[${new Date().toLocaleTimeString()}] ✅ Sauvegarde supprimée`
              ],
              endTime: new Date().toISOString()
            }
          : cmd
      ))
    }, 1000)

    return commandId
  }

  const restoreBackup = async (backupId: string) => {
    const backup = backups.find(b => b.id === backupId)
    if (!backup) return

    const commandId = `restore-${Date.now()}`
    const newCommand: InfrastructureCommand = {
      id: commandId,
      command: `restore backup ${backup.name}`,
      status: 'running',
      output: [
        `[${new Date().toLocaleTimeString()}] Début de la restauration...`,
        `[${new Date().toLocaleTimeString()}] Source: ${backup.location}`,
        `[${new Date().toLocaleTimeString()}] Type: ${backup.type}`
      ],
      startTime: new Date().toISOString(),
      user: 'admin'
    }

    setCommands(prev => [newCommand, ...prev.slice(0, 19)])

    const duration = Math.random() * 45000 + 15000 // 15-60 secondes

    setTimeout(() => {
      const success = Math.random() > 0.05 // 95% de succès

      setCommands(prev => prev.map(cmd =>
        cmd.id === commandId
          ? {
              ...cmd,
              status: success ? 'completed' : 'failed',
              output: [
                ...cmd.output,
                `[${new Date().toLocaleTimeString()}] Décompression...`,
                `[${new Date().toLocaleTimeString()}] Restauration des données...`,
                success
                  ? `[${new Date().toLocaleTimeString()}] ✅ Restauration terminée`
                  : `[${new Date().toLocaleTimeString()}] ❌ Échec de la restauration`,
                `[${new Date().toLocaleTimeString()}] Durée: ${Math.floor(duration / 1000)}s`
              ],
              endTime: new Date().toISOString()
            }
          : cmd
      ))
    }, duration)

    return commandId
  }

  return {
    backups,
    commands,
    createBackup,
    deleteBackup,
    restoreBackup
  }
}